import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { XIcon } from "lucide-react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();

  const handleExcKeyPress = (e) => {
    if (e.key === "Escape") {
      setSelectedUser(null);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleExcKeyPress);

    return () => window.removeEventListener("keydown", handleExcKeyPress);
  }, [setSelectedUser]);

  return (
    <div className="flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 max-h-21 px-6 flex-1 ">
      <div className="flex items-center space-x-3">
        <div className="avatar avatar-online ">
          <div className="w-12 rounded-full">
            <img
              src={selectedUser?.profilePicture || "./avatar.png"}
              alt={selectedUser?.fullName || "User"}
            />
          </div>
        </div>

        <div className="">
          <h3 className="text-slate-200 font-medium">
            {selectedUser?.fullName}
          </h3>
          <p className="text-slate-400 text-sm">Online</p>
        </div>
      </div>

      <button onClick={() => setSelectedUser(null)}>
        <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
      </button>
    </div>
  );
};

export default ChatHeader;
