import { Socket } from "socket.io";
import { IConversation } from "../models/Conversation";
import { IUser } from "../models/User";

interface SendMessage {
  message: string;
  uniqueId: string;
}

export function socketListener(socket: Socket) {
  const conversation: IConversation = socket.request.conversation;
  const user: IUser = socket.request.user;

  const currentRoom = socket.nsp.to(conversation._id);

  socket.on("message", async (msg: SendMessage) => {
    const message = await conversation.sendMessage(msg.message, user._id);
    currentRoom.emit(
      "message",
      JSON.stringify({ uniqueId: msg.uniqueId, message })
    );
  });
}
