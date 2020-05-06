import mongoose, { Document, Model } from "mongoose";
import { IUser } from "./User";
import { IPost } from "./Post";

import "./Post";

interface ICommentSchema extends Document {
  user: IUser["_id"];
  post: IPost["_id"];
  message: string;
  replies?: Array<mongoose.Types.ObjectId>;
  replyOf?: ICommentSchema["_id"];
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment extends ICommentSchema {}
export interface ICommentModel extends Model<IComment> {}

export const commentSchema = new mongoose.Schema<IComment>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    replies: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    },
    replyOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.model<IComment, ICommentModel>(
  "Comment",
  commentSchema
);
