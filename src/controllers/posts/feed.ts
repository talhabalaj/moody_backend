import { ExpressRequest } from "../../enhancements/ExpressRequest";
import { ExpressResponse } from "../../enhancements/ExpressResponse";
import assert from "assert";
import { createError } from "../../lib/errors";
import { Post } from "../../models/Post";
import { createResponse } from "../../lib/response";

export const feed = async (req: ExpressRequest, res: ExpressResponse) => {
  assert(req.user, "[feed] Should be called on a protected route");

  const { user } = req;
  assert(user?.following, "[feed] following on user must exist");

  if (user && user.following) {
    console.log(user.following.toObject());
    const posts = await Post.find({ user: { $in: user.following } });
    return createResponse(res, {
      status: 200,
      message: "Successful",
      data: { posts },
    });
  } else {
    return createError(res, { code: 500 });
  }
};
