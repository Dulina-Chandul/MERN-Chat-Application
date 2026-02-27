import Message from "../../models/message/message.model.js";
import User from "../../models/user/User.model.js";

export const messageController = {
  getAllContactsHandler: async (req, res) => {
    try {
      const loggedInUserId = req.user._id;

      const filteredUsers = await User.find({
        _id: { $ne: loggedInUserId },
      }).select("-password");
      return res.status(200).json({ contacts: filteredUsers });
    } catch (error) {
      console.log("Error fetching contacts:", error.message);
      return res.status(500).json({ message: "Error fetching contacts" });
    }
  },
  getChatPartnersHandler: async (req, res) => {},
  getMessageByUserIdsHandler: async (req, res) => {
    try {
      const myId = req.user._id;
      const otherUserId = req.params.id;

      const messages = await Message.find({
        $or: [
          {
            senderId: myId,
            receiverId: otherUserId,
          },
          {
            senderId: otherUserId,
            receiverId: myId,
          },
        ],
      });

      return res
        .status(200)
        .json({ message: "Messages fetched successfully", messages });
    } catch (error) {
      console.log("Error fetching messages:", error.message);
      return res.status(500).json({ message: "Error fetching messages" });
    }
  },
  sendMessageHandler: async (req, res) => {},
};
