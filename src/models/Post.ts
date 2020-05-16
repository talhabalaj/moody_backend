import mongoose, { Document, Model } from "mongoose";
import { IUser } from "./User";
import { IComment, Comment } from "./Comment";
import "./Comment";
import "./User";

interface IPostSchema extends Document {
  user: IUser["_id"];
  imageUrl: string;
  imagePublicId: string;
  caption: string;
  likes: mongoose.Types.Array<IUser["_id"]>;
  comments: mongoose.Types.Array<IComment["_id"]>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPost extends IPostSchema {
  like: (userId: mongoose.Types.ObjectId) => Promise<boolean>;
  unlike: (userId: mongoose.Types.ObjectId) => Promise<boolean>;
  comment: (
    user: mongoose.Types.ObjectId,
    comment: string,
    replyOf?: mongoose.Types.ObjectId
  ) => Promise<IComment>;
  deleteComment: (commentId: mongoose.Types.ObjectId) => Promise<boolean>;
}
export interface IPostModel extends Model<IPost> {}
export interface IPost_withPLikes extends IPost {
  likes: mongoose.Types.Array<IUser>;
}
export interface IPost_withPComments extends IPost {
  comments: mongoose.Types.Array<IComment>;
}

export interface IPost_withPUser extends IPost {
  user: IUser;
}

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
    imagePublicId: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: "",
    },
    likes: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    comments: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
      default: [],
    },
  },
  { timestamps: true }
);

postSchema.methods.like = async function (
  this: IPost,
  userId: mongoose.Types.ObjectId
) {
  if (this.likes.indexOf(userId) == -1) {
    this.likes.push(userId);
    this.save();
    return true;
  }
  return false;
};

postSchema.methods.unlike = async function (
  this: IPost,
  userId: mongoose.Types.ObjectId
) {
  if (this.likes.indexOf(userId) != -1) {
    this.likes.pull(userId);
    this.save();
    return true;
  }
  return false;
};

postSchema.methods.comment = async function (
  this: IPost,
  user: mongoose.Types.ObjectId,
  comment: String,
  replyOf?: mongoose.Types.ObjectId
) {
  const newComment = await Comment.create({
    user,
    post: this._id,
    replyOf: replyOf ? replyOf : null,
    message: comment,
  });
  this.comments.push(newComment._id);
  this.save();

  return newComment;
};

postSchema.methods.deleteComment = async function (
  this: IPost,
  commentId: mongoose.Types.ObjectId
) {
  const comment = await Comment.findByIdAndDelete(commentId);
  if (comment) {
    this.comments.pull(commentId);
    this.save();
    return true;
  }

  return false;
};

export const Post = mongoose.model<IPost, IPostModel>("Post", postSchema);
