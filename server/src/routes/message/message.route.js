import express from "express";
import { messageController } from "../../controllers/message/message.controller.js";
import { authenticate } from "../../middleware/auth/auth.middleware.js";

const messageRouter = express.Router();

messageRouter.use(authenticate);

//* Get all contacts
messageRouter.get(
  "/contacts",

  messageController.getAllContactsHandler,
);

//* Get chat partners
messageRouter.get(
  "/chats",

  messageController.getChatPartnersHandler,
);

//* Send a message
messageRouter.post(
  "/send/:id",

  messageController.sendMessageHandler,
);

//* Get messages by user id
messageRouter.get(
  "/:id",

  messageController.getMessageByUserIdsHandler,
);

export default messageRouter;
