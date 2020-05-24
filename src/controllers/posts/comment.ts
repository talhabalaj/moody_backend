import { ExpressRequest } from "../../enhancements/ExpressRequest";
import { ExpressResponse } from "../../enhancements/ExpressResponse";
import { createError } from "../../lib/errors";
import assert from "assert";
import { Post } from "../../models/Post";
import { Comment } from "../../models/Comment";
import { Types } from "mongoose";
import { createResponse } from "../../lib/response";

export const createComment = async (
  req: ExpressRequest,
  res: ExpressResponse
) => {
  assert(req.user, "[createComment] should be called with req.user");

  const { postId } = req.params;
  const { message, replyOf } = req.body;

  const post = await Post.findById(postId);
  let replyOfId: Types.ObjectId | undefined = undefined;

  if (!message)
    return createError(res, {
      code: 400,
      args: ["Comment message must be given."],
    });

  if (replyOf) replyOfId = (await Comment.findById(replyOf))?._id;

  if (post) {
    const comment = await post.comment(
      req.user?._id,
      <string>message,
      replyOfId
    );

    return createResponse(res, {
      status: 200,
      data: { comment: await Comment.findById(comment._id).populate("user") },
      message: "Successful",
    });
  }

  return createError(res, {
    code: 404,
    args: ["The post you are looking for doesnt exist"],
  });
};

export const deleteComments = async (
  req: ExpressRequest,
  res: ExpressResponse
) => {
  assert(req.user, "[deleteComment] should be called with req.user");
  const { commentId } = req.params;
  const { user } = req;
  const comment = await Comment.findById(commentId);

  if (comment) {
    const post = await Post.findById(comment.post);

    if (post) {
      if (
        String(post.user) === String(user?._id) ||
        String(comment.user) === String(user?.id)
      ) {
        // current user owns the post
        // or the coment was made by the current user

        // if comment has replies delete them
        if (comment.replies && comment.replies.length > 0) {
          await Comment.deleteMany({ _id: { $in: comment.replies } });
        }
        // remove comment reference in post
        post.comments.pull(comment._id);
        await post.save();

        // finally delete the comment
        await comment.remove();

        return createResponse(res, {
          status: 200,
          message: "Successfull",
        });
      }
    }
    return createError(res, {
      code: 403,
      args: ["Comment cannot be deleted."],
    });
  } else {
    return createError(res, {
      code: 404,
      args: ["The comment you want to delete doesn't exist"],
    });
  }
};
