import jwt, { JsonWebTokenError } from "jsonwebtoken";

import { AuthToken } from "../models/AuthToken";
import { Conversation } from "../models/Conversation";
import { Socket } from "socket.io";
import { User } from "../models/User";
import { secret } from "../config";

export const socketAuthHandler = async (socket: Socket, next: Function) => {
  if (
    socket.handshake.query &&
    (socket.handshake.query.token || socket.handshake.headers["cookie"]) &&
    socket.handshake.query.conversation
  ) {
    const token =
      socket.handshake.query.token ||
      socket.handshake.headers["cookie"].split("=")[1];
    const conversationId = socket.handshake.query.conversation;
    const tokenInfo = await AuthToken.findOne({ token });
    if (tokenInfo?.isValid) {
      try {
        // @ts-ignore
        const { id } = jwt.verify(token, secret);
        const user = await User.findById(id)
          .select(
            "+followers +following +followerCount +followingCount +email +bio"
          )
          .populate("followers")
          .populate("following");

        if (user) {
          socket.request.user = user;
          socket.request.tokenInfo = tokenInfo;

          const conversationObj = await Conversation.findById(conversationId);
          if (
            conversationObj &&
            conversationObj.members.includes(String(user._id))
          ) {
            socket.request.conversation = conversationObj;
            socket.join(conversationId);
            return next();
          }
          return next(Error("Invalid conversation Id."));
        }
      } catch (e) {
        return next(e);
      }
    }
  }
  return next(Error("No token was provided"));
};
