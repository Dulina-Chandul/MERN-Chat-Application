import cloudinary from "../../config/cloudinary.js";
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
  sendMessageHandler: async (req, res) => {
    try {
      const { text, image } = req.body;

      const receiverId = req.params.id;
      const senderId = req.user._id;

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

      return res
        .status(201)
        .json({ message: "Message sent successfully", newMessage });

      //TODO : send message in real time using socket.io
    } catch (error) {
      console.log("Error sending message:", error.message);
      return res.status(500).json({ message: "Error sending message" });
    }
  },
};
