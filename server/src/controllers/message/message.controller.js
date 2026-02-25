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
  getMessageByUserIdsHandler: async (req, res) => {},
  sendMessageHandler: async (req, res) => {},
};
