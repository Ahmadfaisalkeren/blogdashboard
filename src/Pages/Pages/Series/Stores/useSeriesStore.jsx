import { create } from "zustand";
import axios from "axios";
import { API_URL } from "../../../../Components/API/ConfigAPI";

const useSeriesStore = create((set) => ({
  series: [],
  loading: false,
  error: null,
  showToast: false,
  toastMessage: "",

  fetchSeries: async () => {
    set({ error: null });
    try {
      const response = await axios.get(`${API_URL}/api/series`);
      set({ series: response.data.series });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  addSeries: async (seriesData, navigate) => {
    set({ error: null });
    try {
      await axios.post(`${API_URL}/api/series`, seriesData, {
        headers: {
          "X-CSRF-TOKEN": document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content"),
        },
      });

      set({
        toastMessage: "Series added successfully",
        showToast: true,
      });
      navigate("/series");
    } catch (error) {
      set({
        error: error.response?.data?.errors || "An unexpected error occurred",
      });
    } finally {
      set({ loading: false });
    }
  },

  updateSeries: async (seriesData, navigate) => {
    set({ loading: true, error: null });
    try {
      await axios.put(`${API_URL}/api/series/${seriesData.id}`, seriesData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      set((state) => ({
        series: state.series.map((series) =>
          series.id === seriesData.id ? { ...series, ...seriesData } : series
        ),
        toastMessage: "Series updated successfully!",
        showToast: true,
      }));

      navigate("/series", {
        state: { message: "Series updated successfully!" },
      });
    } catch (error) {
      set({
        error: error.response?.data?.errors || "An unexpected error occurred",
      });
    } finally {
      set({ loading: false });
    }
  },

  updateSeriesStatus: async (seriesId, newStatus) => {
    try {
      await axios.put(`${API_URL}/api/series/${seriesId}`, {
        status: newStatus,
      });

      set((state) => ({
        series: state.series.map((series) =>
          series.id === seriesId ? { ...series, status: newStatus } : series
        ),
        toastMessage:
          newStatus === "hide" ? "Series di Sembunyikan" : "Series di Publish",
        showToast: true,
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  fetchSeriesById: async (id) => {
    set({ error: null });
    try {
      const response = await axios.get(`${API_URL}/api/series/${id}`);
      return response.data.series;
    } catch (error) {
      set({ error: error.message });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  deleteSeries: async (seriesId) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_URL}/api/series/${seriesId}`);
      set((state) => ({
        series: state.series.filter((series) => series.id !== seriesId),
        toastMessage: "Series deleted successfully!",
        showToast: true,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete series.",
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchSeriesPartBySeriesId: async (seriesId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}/api/seriesParty/${seriesId}`
      );
      set({ seriesPart: response.data.seriesPart });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  setToast: (message) => set({ toastMessage: message, showToast: true }),
  hideToast: () => set({ showToast: false }),
}));

export default useSeriesStore;
