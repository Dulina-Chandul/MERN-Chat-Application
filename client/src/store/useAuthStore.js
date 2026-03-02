import { create } from "zustand";
import axiosInstance from "../../config/api/axiosInstance.js";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      if (res.data.user) {
        set({ authUser: res.data.user });
      }
    } catch (error) {
      console.log("Error while checking auth: " + error.message);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
