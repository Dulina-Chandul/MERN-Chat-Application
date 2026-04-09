import React, { useRef, useState } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";

const MessageInput = () => {
  const { playRandomKeyStrokeSound } = useKeyboardSound();

  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const { isSoundEnabled, sendMessage } = useChatStore();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    if (isSoundEnabled) playRandomKeyStrokeSound();

    sendMessage({ text: text.trim(), image: imagePreview });

    setText("");
    setImagePreview("");

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return <div>MessageInput</div>;
};

export default MessageInput;
