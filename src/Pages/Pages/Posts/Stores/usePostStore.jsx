import { create } from "zustand";
import axios from "axios";
import { API_URL } from "../../../../Components/API/ConfigAPI";

const usePostStore = create((set) => ({
  posts: [],
  loading: false,
  error: null,
  showToast: false,
  toastMessage: "",

  fetchPosts: async () => {
    set({ error: null });
    try {
      const response = await axios.get(`${API_URL}/api/posts`);
      set({ posts: response.data.posts });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  addPost: async (postData, navigate) => {
    set({ error: null });
    try {
      const response = await axios.post(`${API_URL}/api/post`, postData, {
        headers: {
          "X-CSRF-TOKEN": document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content"),
        },
      });

      set((state) => ({
        posts: [...state.posts, response.data.post],
        toastMessage: "Post added successfully",
        showToast: true,
      }));
      navigate("/posts");
    } catch (error) {
      set({
        error: error.response?.data?.errors || "An unexpected error occurred",
      });
    } finally {
      set({ loading: false });
    }
  },

  updatePost: async (postData, navigate) => {
    set({ error: null });
    try {
      await axios.put(`${API_URL}/api/post/${postData.id}`, postData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postData.id ? { ...post, ...postData } : post
        ),
        toastMessage: "Post updated successfully!",
        showToast: true,
      }));

      navigate("/posts", { state: { message: "Post updated successfully!" } });
    } catch (error) {
      set({
        error: error.response?.data?.errors || "An unexpected error occurred",
      });
    } finally {
      set({ loading: false });
    }
  },

  updatePostStatus: async (postId, newStatus) => {
    try {
      await axios.put(`${API_URL}/api/post/${postId}`, {
        status: newStatus,
      });

      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId ? { ...post, status: newStatus } : post
        ),
        toastMessage:
          newStatus === "hide" ? "Post di Sembunyikan" : "Post di Publish",
        showToast: true,
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  fetchPostById: async (id) => {
    set({ error: null });
    try {
      const response = await axios.get(`${API_URL}/api/post/${id}`);
      return response.data.post;
    } catch (error) {
      set({ error: error.message });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  deletePost: async (postId) => {
    set({ error: null });
    try {
      await axios.delete(`${API_URL}/api/post/${postId}`);
      set((state) => ({
        posts: state.posts.filter((post) => post.id !== postId),
        toastMessage: "Post deleted successfully!",
        showToast: true,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete post.",
      });
    } finally {
      set({ loading: false });
    }
  },

  setToast: (message) => set({ toastMessage: message, showToast: true }),
  hideToast: () => set({ showToast: false }),
}));

export default usePostStore;
