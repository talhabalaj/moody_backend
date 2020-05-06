import { ExpressRequest } from "../../enhancements/ExpressRequest";
import { ExpressResponse } from "../../enhancements/ExpressResponse";
import assert from "assert";
import { createError } from "../../lib/errors";
import {
  Post,
  IPost_withPComments,
  IPost_withPLikes,
  IPost_withPUser,
} from "../../models/Post";
import { createResponse } from "../../lib/response";

export const feed = async (req: ExpressRequest, res: ExpressResponse) => {
  assert(req.user, "[feed] Should be called on a protected route");

  const { user } = req;
  const { offset } = req.query;
  assert(user?.following, "[feed] following on user must exist");

  if (user && user.following) {
    const posts = await Post.find({
      user: { $in: [...user.following, user._id] },
    })
      .sort({ createdAt: -1 })
      .skip(offset ? parseInt(<string>offset) : 0)
      .limit(10)
      .populate("user")
      .populate("comments");

    return createResponse(res, {
      status: 200,
      message: "Successful",
      data: { posts },
    });
  } else {
    return createError(res, { code: 500 });
  }
};
