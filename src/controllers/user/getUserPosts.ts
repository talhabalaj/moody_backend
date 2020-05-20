import { ExpressRequest } from "../../enhancements/ExpressRequest";
import { createResponse } from "../../lib/response";
import { ExpressResponse } from "../../enhancements/ExpressResponse";
import { User, IUser } from "../../models/User";
import { createError } from "../../lib/errors";
import { Post, IPost } from "../../models/Post";
import assert from "assert";

export const getUserPosts = async (
  req: ExpressRequest,
  res: ExpressResponse
) => {
  const { user } = req;
  const { id } = req.params;
  const { offset = "0" } = req.query;

  assert(req.user, "[getUserPosts] requires req.user");

  let userId = user?._id;

  if (id) {
    let user = await User.findById(id);
    if (user) {
      userId = user._id;
    } else {
      return createError(res, {
        code: 404,
        args: ["This user doesn't match with any existing account."],
      });
    }
  }

  let posts = await Post.find({ user: userId })
    .populate({
        path: "comments",
        populate: {
          path: "user",
          model: "User",
        },
      })
    .populate("user")
    .sort({ createdAt: -1 })
    .skip(parseInt(<string>offset))
    .limit(10);

  return createResponse(res, {
    data: { posts },
    message: "Successful",
    status: 200,
  });
};
