import mongoose, { Document, Model } from "mongoose";
import "./User";
import { IMessage, Message } from "./Message";
import { IUser } from "./User";

interface IConversationSchema extends Document {
  members: mongoose.Types.Array<IUser["_id"]>;
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
  },
  { timestamps: true }
);

ConversationSchema.methods.sendMessage = async function (
  message: string,
  from: mongoose.Types.ObjectId
) {
  const messageModel = (
    await Message.create({
      from,
      content: message,
      conversation: this._id,
    })
  )
    .populate("conversation")
    .populate("from");

  // TODO: notification

  return messageModel;
};

export const Conversation = mongoose.model<IConversation, IConversationModel>(
  "Conversation",
  ConversationSchema
);
