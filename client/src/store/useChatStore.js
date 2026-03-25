import { create } from "zustand";
import axiosInstance from "../../config/api/axiosInstance";
import toast from "react-hot-toast";

export const useChatStoe = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => {
    set({ activeTab: tab });
  },

  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },

  getAllContacts: async () => {
    set({ isUserLoading: true });

    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data.contacts });
    } catch (error) {
      console.log("Error while getting contacts : " + error.message);
      toast.error(
        Error.response?.data?.message ||
          "Error while getting contacts : " + error.message,
      );
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isMessagesLoading: true });

    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data.chatPartners });
    } catch (error) {
      console.log("Error while getting messages : " + error.message);
      toast.error(
        Error.response?.data?.message ||
          "Error while getting messages : " + error.message,
      );
    } finally {
      set({ isMessagesLoading: false });
    }
  },
}));
