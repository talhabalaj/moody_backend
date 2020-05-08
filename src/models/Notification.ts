import mongoose, { Document, Model } from "mongoose";

import "./User";
import { IUser } from "./User";

interface INotificationSchema extends Document {
  user: IUser["_id"];
  message: string;
  read: boolean;
}

export interface INotification extends INotificationSchema {}
export interface INotificationModel extends Model<INotification> {}

export const notificationSchema = new mongoose.Schema<INotification>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification, INotificationModel>(
  "Notification",
  notificationSchema
);
