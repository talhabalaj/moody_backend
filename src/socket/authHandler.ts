import { Socket } from "socket.io";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { AuthToken } from "../models/AuthToken";
import { secret } from "../config";
import { User } from "../models/User";

export const socketAuthHandler = async (socket: Socket, next: Function) => {
  if (socket.handshake.query && socket.handshake.query.token) {
    const token = socket.handshake.query.token;
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
          return next();
        }
      } catch (e) {
        return next(e);
      }
    }
  }
  return next(Error("No token was provided"));
};
