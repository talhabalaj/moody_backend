import assert from "assert";

import { ExpressRequest } from "../../enhancements/ExpressRequest";
import { ExpressResponse } from "../../enhancements/ExpressResponse";
import { createError } from "../../lib/errors";
import { Post } from "../../models/Post";
import { createResponse } from "../../lib/response";

export const deletePost = async (req: ExpressRequest, res: ExpressResponse) => {
  assert(req.user, "[deletePost] Should be routed with authenticated route.");

  const { postId } = req.params;

  const post = await Post.findByIdAndDelete(postId);

  if (post) {
    return createResponse(res, { status: 200, message: "Successful!" });
  } else {
    return createError(res, { code: 404, args: ["Post not found!"] });
  }
};
