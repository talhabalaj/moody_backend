import { IConversation } from "../models/Conversation";
import { IUser } from "../models/User";
import { Message } from "../models/Message";
import { Socket } from "socket.io";

interface SendMessage {
  message: string;
  uniqueId: string;
}

export function socketListener(socket: Socket) {
  const conversation: IConversation = socket.request.conversation;
  const user: IUser = socket.request.user;

  const currentRoom = socket.nsp.to(conversation._id);

  socket.on("message", async (msg: string) => {
    const messageContent = JSON.parse(msg);
    const message = await conversation.sendMessage(
      messageContent.message,
      user._id
    );
    currentRoom.emit(
      "message",
      JSON.stringify({ uniqueId: messageContent.uniqueId, message })
    );
  });

  socket.on("message_seen", async (data: string) => {
    const { messageIds }: { messageIds: string[] } = JSON.parse(data);

    const updated = await Message.updateMany(
      { _id: { $in: messageIds } },
      { seen: true }
    );
    currentRoom.emit(
      "message_seen",
      JSON.stringify({ messageIds: messageIds, updated })
    );
  });
}
