import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";

const ChatContainer = () => {
  const { selectedUser, messages, isMessagesLoading, getMessagesByUserId } =
    useChatStore();

  const { authUser } = useAuthStore();

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
  }, [selectedUser, getMessagesByUserId]);

  return (
    <>
      <ChatHeader />
    </>
  );
};

export default ChatContainer;
