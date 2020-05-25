import { Router } from "express";
import { authProvider, protectedRoute } from "../../middleware/auth";
import {
  createConvo,
  getConversations,
  getMessages,
} from "../../controllers/message";

const messageRouter = Router();

messageRouter.get("/init/:to", authProvider, protectedRoute, createConvo);
messageRouter.get("/all", authProvider, protectedRoute, getConversations);
messageRouter.get(
  "/:conversationId",
  authProvider,
  protectedRoute,
  getMessages
);

export { messageRouter };
