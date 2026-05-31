import { create } from "zustand";
import axiosInstance from "../../config/api/axiosInstance.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      if (res.data.user) {
        set({ authUser: res.data.user });
        console.log("Auth user from check: ", res.data.user);
        get().connectSocket();
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
        console.log("Auth user from signup: ", res.data.user);

        toast.success(res.data.message || "Signup successful!");

        get().connectSocket();
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
        console.log("Auth user from login: ", res.data.user);

        toast.success(res.data.message || "Logging Successfull!");

        get().connectSocket();
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

      get().disconnectSocket();
    } catch (error) {
      console.log("Error while logged out : " + error.message);
      toast.error(
        error?.response?.data?.message ||
          "Error while logged out : " + error.message,
      );
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res?.data?.user });
      toast.success(res?.data?.message || "Profile updated successfully");
    } catch (error) {
      console.log("Error while updating profile : " + error.message);
      toast.error(
        error?.response?.data?.message ||
          "Error while updating profile : " + error.message,
      );
    }
  },

  connectSocket: () => {
    const { authUser } = get();

    if (!authUser || get().socket?.connected) {
      return;
    }

    const socket = io(BASE_URL, {
      withCredentials: true,
    });

    socket.connect();

    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket?.disconnect();
  },
}));
