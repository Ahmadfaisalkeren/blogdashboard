import { create } from "zustand";
import axios from "axios";
import { API_URL } from "../../../../Components/API/ConfigAPI";

const useHeroStore = create((set) => ({
  heroes: [],
  loading: false,
  error: null,
  showToast: false,
  toastMessage: "",

  fetchHeroes: async () => {
    set({ error: null });
    try {
      const response = await axios.get(`${API_URL}/api/heroes`);
      set({ heroes: response.data.heroes });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  addHero: async (heroData, onClose) => {
    set({ error: null });

    try {
      await axios.post(`${API_URL}/api/hero`, heroData, {
        headers: {
          "X-CSRF-TOKEN": document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content"),
        },
      });

      await useHeroStore.getState().fetchHeroes();

      set({
        showToast: true,
        toastMessage: "Hero added successfully",
      });
      onClose();
    } catch (error) {
      set({
        error: error.response?.data?.errors || "An unexpected error occurred",
      });
    } finally {
      set({ loading: false });
    }
  },

  updateHero: async (id, heroData, onClose) => {
    set({ error: null });

    try {
      const response = await axios.post(`${API_URL}/api/hero/${id}`, heroData, {
        headers: {
          "X-CSRF-TOKEN": document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content"),
        },
      });

      set((state) => ({
        heroes: state.heroes.map((hero) =>
          hero.id === id ? { ...hero, ...response.data.hero } : hero
        ),
        showToast: true,
        toastMessage: "Hero updated successfully",
      }));
      onClose();
    } catch (error) {
      set({
        error: error.response?.data?.errors || "An unexpected error occurred",
      });
    } finally {
      set({ loading: false });
    }
  },

  deleteHero: async (id, onClose) => {
    set({ error: null });

    try {
      await axios.delete(`${API_URL}/api/hero/${id}`);

      set((state) => ({
        heroes: state.heroes.filter((hero) => hero.id !== id),
        toastMessage: "Hero deleted successfully!",
        showToast: true,
      }));
      onClose();
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete hero",
      });
    } finally {
      set({ loading: false });
    }
  },

  setToast: (message) => set({ toastMessage: message, showToast: true }),
  hideToast: () => set({ showToast: false }),
}));

export default useHeroStore;
