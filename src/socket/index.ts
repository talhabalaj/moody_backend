import { Socket } from "socket.io";
import { IConversation } from "../models/Conversation";
import { IUser } from "../models/User";

export function socketListener(socket: Socket) {
  const conversation: IConversation = socket.request.conversation;
  const user: IUser = socket.request.user;

  const currentRoom = socket.nsp.to(conversation._id);

  socket.on("message", async (msg) => {
    console.log(`message from ${socket.request.user.userName}:` + msg);
    const message = await conversation.sendMessage(msg, user._id);
    currentRoom.emit("message", message);
  });
}
