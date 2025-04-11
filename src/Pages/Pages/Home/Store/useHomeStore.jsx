import { create } from "zustand";
import axios from "axios";
import { API_URL } from "../../../../Components/API/ConfigAPI";

const useHomeStore = create((set) => ({
  dashboard: null, // Change to null to avoid empty object issues
  loading: false,
  error: null,

  fetchDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/api/dashboard`);
      set({ dashboard: response.data.data });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useHomeStore;
