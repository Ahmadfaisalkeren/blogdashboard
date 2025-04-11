import { create } from "zustand";
import axios from "axios";
import { API_URL } from "../../../../Components/API/ConfigAPI";

const useSeriesPartStore = create((set) => ({
  seriesPart: [],
  loading: false,
  error: null,
  showToast: false,
  toastMessage: "",

  fetchSeriesPartBySeriesId: async (seriesId) => {
    set({ error: null });
    try {
      const response = await axios.get(
        `${API_URL}/api/seriesParty/${seriesId}`
      );
      set({ seriesPart: response.data.seriesPart });
      return response.data.seriesPart;
    } catch (error) {
      set({ error: error.message });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  addSeriesPart: async (seriesId, seriesData, navigate) => {
    set({ loading: true, error: null });
    try {
      await axios.post(`${API_URL}/api/seriesPart`, seriesData, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content"),
        },
      });

      set({
        toastMessage: "Series Part added successfully",
        showToast: true,
      });
      navigate(`/detail-series/${seriesId}`);
    } catch (error) {
      set({
        error: error.response?.data?.errors || "An unexpected error occurred",
      });
    } finally {
      set({ loading: false });
    }
  },

  updateSeriesPart: async (seriesData, navigate) => {
    set({ loading: true, error: null });
    try {
      await axios.put(
        `${API_URL}/api/seriesPart/${seriesData.id}`,
        seriesData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      set((state) => ({
        seriesPart: state.seriesPart.map((seriesPart) =>
          seriesPart.id === seriesData.id
            ? { ...seriesPart, ...seriesData }
            : seriesPart
        ),
        toastMessage: "Series Part updated successfully!",
        showToast: true,
      }));

      navigate(`/detail-series/${seriesData.series_id}`, {
        state: { message: "Series Part updated successfully!" },
      });
    } catch (error) {
      set({
        error: error.response?.data?.errors || "An unexpected error occurred",
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchSeriesPartById: async (id) => {
    set({ error: null });
    try {
      const response = await axios.get(`${API_URL}/api/seriesParty/${id}/show`);
      return response.data.seriesPart;
    } catch (error) {
      set({ error: error.message });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  deleteSeriesPart: async (seriesId) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_URL}/api/seriesPart/${seriesId}`);
      set((state) => ({
        seriesPart: state.seriesPart.filter(
          (seriesPart) => seriesPart.id !== seriesId
        ),
        toastMessage: "Series Part deleted successfully!",
        showToast: true,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete seriesPart.",
      });
    } finally {
      set({ loading: false });
    }
  },

  setToast: (message) => set({ toastMessage: message, showToast: true }),
  hideToast: () => set({ showToast: false }),
}));

export default useSeriesPartStore;
