import cloudinary from "../../config/cloudinary.js";
import { getReceiverSocketId, io } from "../../config/socket.js";
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
  getChatPartnersHandler: async (req, res) => {
    try {
      const loggedInUserId = req.user._id;

      const messages = await Message.find({
        $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
      });

      const chatPartnerIds = [
        ...new Set(
          messages.map((msg) =>
            msg.senderId.equals(loggedInUserId)
              ? msg.receiverId.toString()
              : msg.senderId.toString(),
          ),
        ),
      ];

      const chatPartners = await User.find({
        _id: { $in: chatPartnerIds },
      }).select("-password");

      return res
        .status(200)
        .json({ message: "Chat partners fetched successfully", chatPartners });
    } catch (error) {
      console.log("Error fetching chat partners:", error.message);
      return res.status(500).json({ message: "Error fetching chat partners" });
    }
  },
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
  sendMessageHandler: async (req, res) => {
    try {
      const { text, image } = req.body;

      const receiverId = req.params.id;
      const senderId = req.user._id;

      if (!text && !image) {
        return res
          .status(400)
          .json({ message: "Message text or image is required" });
      }

      if (senderId.equals(receiverId)) {
        return res
          .status(400)
          .json({ message: "You cannot send message to yourself" });
      }

      const receiverExists = await User.exists({ _id: receiverId });
      if (!receiverExists) {
        return res.status(404).json({ message: "Receiver not found" });
      }

      let imageUrl;

      if (image) {
        const uploadedImage = await cloudinary.uploader.upload(image, {
          folder: "MERN-Chat-Application",
        });
        imageUrl = uploadedImage.secure_url;
      }

      const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image: imageUrl,
      });

      await newMessage.save();

      const receiverSocketId = getReceiverSocketId(receiverId.toString());
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }

      return res
        .status(201)
        .json({ message: "Message sent successfully", newMessage });
    } catch (error) {
      console.log("Error sending message:", error.message);
      return res.status(500).json({ message: "Error sending message" });
    }
  },
};
