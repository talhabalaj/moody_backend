import mongoose, { Document, Model } from "mongoose";
import "./User";
import { IMessage, Message } from "./Message";
import { IUser, User } from "./User";
import { Notification } from "./Notification";
import { firebaseApp } from "../lib/firebase";

interface IConversationSchema extends Document {
  members: mongoose.Types.Array<IUser["_id"]>;
  messages: mongoose.Types.Array<IMessage["_id"]>;
  sendMessage: (
    message: string,
    from: mongoose.Types.ObjectId
  ) => Promise<IMessage>;
}

export interface IConversation extends IConversationSchema {}
export interface IConversationModel extends Model<IConversation> {}

export const ConversationSchema = new mongoose.Schema<IConversation>(
  {
    members: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      required: true,
    },
    messages: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
      default: [],
    },
  },
  { timestamps: true }
);

ConversationSchema.methods.sendMessage = async function (
  message: string,
  from: mongoose.Types.ObjectId
) {
  let messageModel = await Message.create({
    from,
    content: message,
    conversation: this._id,
  });

  this.messages.push(messageModel._id);
  await this.save();

  const newMessageModel = await Message.findById(messageModel._id).populate(
    "from"
  );

  (async () => {
    const to = String(this.members.find((e) => String(e) != String(from)));
    const user = await User.findById(from);

    if (user) {
      firebaseApp.messaging().sendToTopic(to, {
        notification: {
          title: `${user.userName}`,
          body: `${message}`,
        },
      });
    }
  })();

  return <IMessage>newMessageModel;
};

export const Conversation = mongoose.model<IConversation, IConversationModel>(
  "Conversation",
  ConversationSchema
);
