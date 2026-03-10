import { create } from "zustand";
import axiosInstance from "../../config/api/axiosInstance.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,

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

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      if (res?.data?.user) {
        set({ authUser: res.data.user });

        toast.success(res.data.message || "Signup successful!");
      }
    } catch (error) {
      console.log("Error while signing up: " + error.message);
      toast.error(
        error.response?.data?.message ||
          "Error while signing up : " + error.message,
      );
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      if (res?.data?.user) {
        set({ authUser: res?.data?.user });

        toast.success(res.data.message || "Logging Successfull!");
      }
    } catch (error) {
      console.log("Error while logging in : " + error.message);
      toast.error(
        error.response?.data?.message ||
          "Error while logging in : " + error.message,
      );
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      console.log("Error while logged out : " + error.message);
      toast.error(
        error?.response?.data?.message ||
          "Error while logged out : " + error.message,
      );
    }
  },
}));
