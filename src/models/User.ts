import mongoose, { Document, Model } from "mongoose";
import { hashPassword } from "../lib/hash";

interface IUserSchema extends Document {
  firstName: string;
  lastName: string;
  bio: string;
  phoneNumber?: string;
  email: string;
  userName: string;
  password?: string;
  followers: Array<mongoose.Schema.Types.ObjectId>;
  following: Array<mongoose.Schema.Types.ObjectId>;
  followerCount: number;
  followingCount: number;
  _createdAt: Date;
  _updatedAt: Date;
}

export interface IUser extends IUserSchema {
  fullName: string;
}

export interface IUserModel extends Model<IUser> {}

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 2,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 1,
    },
    phoneNumber: {
      type: String,
    },
    bio: {
      type: String,
      default: "",
      maxlength: 256,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      lowercase: true,
      match: /^[A-z]*$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    followers: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      select: false,
      ref: "User",
    },
    following: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      select: false,
      ref: "User",
    },
    followerCount: {
      type: Number,
      default: 0,
    },
    followingCount: {
      type: Number,
      default: 0,
    },
    _createdAt: {
      type: Date,
      select: false,
    },
    _updatedAt: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: { createdAt: "_createdAt", updatedAt: "_updatedAt" },
  }
);

userSchema.pre<IUser>("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await hashPassword(this.password);
  }
});

userSchema.post<IUser>(/update/i, function (doc, next) {
  if (doc.isModified("following")) doc.followingCount = doc.following.length;
  if (doc.isModified("followers")) doc.followerCount = doc.followers.length;
});

userSchema.virtual("fullName").get(function (this: IUser) {
  return `${this.firstName} ${this.lastName}`;
});

export const User = mongoose.model<IUser, IUserModel>("User", userSchema);
