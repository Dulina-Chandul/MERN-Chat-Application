import React from "react";
import { useChatStoe } from "../store/useChatStore";

const ActiveTabSwitch = () => {
  const { activeTab, setActiveTab } = useChatStoe();

  return (
    <div className="tabs tabs-boxed bg-transparent p-2 m-2 w-full">
      <button
        onClick={() => setActiveTab("chats")}
        className={`tab flex-1 ${activeTab === "chats" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"} rounded-sm`}
      >
        Chats
      </button>
      <button
        onClick={() => setActiveTab("contacts")}
        className={`tab flex-1 ${activeTab === "contacts" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"} rounded-sm`}
      >
        Contacts
      </button>
    </div>
  );
};

export default ActiveTabSwitch;
