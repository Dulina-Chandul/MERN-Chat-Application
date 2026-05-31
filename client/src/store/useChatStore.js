import { create } from "zustand";
import axiosInstance from "../../config/api/axiosInstance";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
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
      console.log("This is the output from the getMyChatPartners: ", res);
      set({ chats: res.data.chatPartners });
    } catch (error) {
      console.log("Error while getting messages : " + error.message);
      toast.error(
        Error.response?.data?.message ||
          "Error while getting messages : " + error?.message,
      );
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });

    try {
      const response = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: response.data.messages });
    } catch (error) {
      console.log("Error while getting messages : " + error.message);
      toast.error(
        Error.response?.data?.message ||
          "Error while getting messages : " + error?.message,
      );
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    set({ messages: [...messages, optimisticMessage] });

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData,
      );
      set({ messages: messages.concat(res.data.newMessage) });
    } catch (error) {
      set({ messages: messages.filter((msg) => !msg.isOptimistic) });
      console.log("Error while sending message : " + error.message);
      toast.error(
        error.response?.data?.message ||
          "Error while sending message : " + error?.message,
      );
    }
  },

  subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get();

    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (message) => {
      const currentMessages = get().messages;
      set({ messages: [...currentMessages, message] });

      if (isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3");
        notificationSound.currentTime = 0;
        notificationSound
          .play()
          .catch((e) => console.log("Error playing sound: ", e));
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));
