import mongoose, { Document, Model } from "mongoose";
import { IUser } from "./User";
import { IComment } from "./Comment";
import "./Comment";
import "./User";

interface IPostSchema extends Document {
  user: IUser["_id"];
  imageUrl: string;
  caption: string;
  likes: Array<IUser["_id"]>;
  comments: Array<IComment["_id"]>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPost extends IPostSchema {}
export interface IPostModel extends Model<IPost> {}

const postSchema = new mongoose.Schema<IPost>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    imageUrl: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: "",
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: "User",
    },
    comments: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: "Comment",
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model<IPost, IPostModel>("Post", postSchema);
