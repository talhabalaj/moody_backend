import { Response } from "express";

import { ExpressRequest } from "../../enhancements/ExpressRequest";
import { createResponse } from "../../lib/response";
import { createError } from "../../lib/errors";
import { setDeleteServerCookieHeader } from "../../lib/header";

export const logoutUser = async (req: ExpressRequest, res: Response) => {
  try {
    if (req.token) {
      await req.token.updateOne({ isValid: false });
      req.user = undefined;
      req.token = undefined;
      setDeleteServerCookieHeader(res, "access_token");
      return createResponse(res, {
        status: 200,
        message: "Successfully logged out.",
        data: { loggedOut: true },
      });
    } else {
      return createError(res, {
        code: 500,
        args: ["Token doesn't exist, not possible in production!"],
      });
    }
  } catch (e) {
    return createError(res, { code: 500, args: [e.message] });
  }
};
