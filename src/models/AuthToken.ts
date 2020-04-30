import mongoose, { Document, Model } from "mongoose";
import "./User";
import { IUser } from "./User";

interface IAuthTokenSchema extends Document {
  user: IUser["_id"];
  token: string;
  isValid: boolean;
  _createdAt: Date;
  _updatedAt: Date;
}

export interface IAuthToken extends IAuthTokenSchema {}
export interface IAuthTokenWithUser extends IAuthToken {
  user: IUser;
}
export interface IAuthTokenModel extends Model<IAuthToken> {}

const authTokenSchema = new mongoose.Schema<IAuthToken>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    token: {
      type: String,
      required: true,
    },
    isValid: {
      type: Boolean,
      required: true,
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
  { timestamps: { createdAt: "_createdAt", updatedAt: "_updatedAt" } }
);

authTokenSchema.post("populate", (doc, next) => {
  console.log("CALLED");
});

export const AuthToken = mongoose.model<IAuthToken, IAuthTokenModel>(
  "AuthToken",
  authTokenSchema
);
