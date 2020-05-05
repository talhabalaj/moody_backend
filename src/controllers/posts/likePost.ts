import { ExpressRequest } from "../../enhancements/ExpressRequest";
import { ExpressResponse } from "../../enhancements/ExpressResponse";
import { Post } from "../../models/Post";
import { createResponse } from "../../lib/response";
import { createError } from "../../lib/errors";
import assert from "assert";

export const likePost = async (req: ExpressRequest, res: ExpressResponse) => {
  assert(req.user, "[likePost] requires req.user");

  const { user } = req;
  const { postId } = req.params;
  const post = await Post.findById(postId);

  if (user && post) {
    const modified = await post.like(user._id);
    return createResponse(res, {
      message: "Successfull",
      data: { modified },
      status: 200,
    });
  }

  return createError(res, { code: 404, args: ["Post wasn't found!"] });
};

export const unLike = async (req: ExpressRequest, res: ExpressResponse) => {
  assert(req.user, "[likePost] requires req.user");

  const { user } = req;
  const { postId } = req.params;
  const post = await Post.findById(postId);

  if (user && post) {
    const modified = await post.unlike(user._id);
    return createResponse(res, {
      message: "Successfull",
      data: { modified },
      status: 200,
    });
  }

  return createError(res, { code: 404, args: ["Post wasn't found!"] });
};
