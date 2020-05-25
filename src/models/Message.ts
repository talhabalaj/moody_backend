import mongoose, { Document, Model } from "mongoose";
import { IUser } from "./User";

import "./User";
import "./Conversation";
import { IConversation } from "./Conversation";

interface IMessageSchema extends Document {
  from: IUser["_id"];
  conversation: IConversation["_id"];
  content: string;
  delivered: boolean;
  seen: boolean;
}

export interface IMessage extends IMessageSchema {}
export interface IMessageModel extends Model<IMessage> {}

export const MessageSchema = new mongoose.Schema<IMessage>(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    delivered: {
      type: Boolean,
      default: false,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model<IMessage, IMessageModel>(
  "Message",
  MessageSchema
);
