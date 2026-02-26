import express from "express";
import { messageController } from "../../controllers/message/message.controller.js";
import { authenticate } from "../../middleware/auth/auth.middleware.js";

const messageRouter = express.Router();

//* Get all contacts
messageRouter.get(
  "/contacts",
  authenticate,
  messageController.getAllContactsHandler,
);

//* Get chat partners
messageRouter.get("/chats", messageController.getChatPartnersHandler);

//* Get messages by user ids
messageRouter.get("/:id", messageController.getMessageByUserIdsHandler);

//* Send a message to the user
messageRouter.post("/send/:id", messageController.sendMessageHandler);

export default messageRouter;
