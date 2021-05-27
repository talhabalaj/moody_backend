import { secret, sessionTime } from "../../config";

import { AuthToken } from "../../models/AuthToken";
import { ExpressRequest } from "../../enhancements/ExpressRequest";
import { Response } from "express";
import { User } from "../../models/User";
import { compare } from "bcrypt";
import { createError } from "../../lib/errors";
import { createResponse } from "../../lib/response";
import jwt from "jsonwebtoken";

export const loginUser = async (
  req: ExpressRequest,
  res: Response
): Promise<Response<any>> => {
  const { userName, password } = req.body;
  const user = await User.findOne({ userName }).select("+password");

  if (user && user.password && (await compare(password, user.password))) {
    const token = jwt.sign({ id: user._id }, secret, {
      expiresIn: sessionTime,
    });
    const tokenInfo = {
      user: user._id,
      token,
      isValid: true,
      expiresAt: new Date(Date.now() + sessionTime),
    };
    const authToken = new AuthToken(tokenInfo);

    try {
      await authToken.save();
      res.setHeader(
        "Set-Cookie",
        `access_token=${token}; HttpOnly;Secure;SameSite=None;`
      );
      return createResponse(res, {
        status: 202,
        message: "Successfully logged in.",
        data: { tokenInfo: tokenInfo },
      });
    } catch (e) {
      return createError(res, { code: 500, args: [e.message] });
    }
  } else {
    return createError(res, { code: 1004 });
  }
};
