import { ExpressRequest } from "../../enhancements/ExpressRequest";
import { ExpressResponse } from "../../enhancements/ExpressResponse";
import { Post } from "../../models/Post";
import { createError } from "../../lib/errors";
import { createResponse } from "../../lib/response";

export const getPost = async (req: ExpressRequest, res: ExpressResponse) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (post) {
      return createResponse(res, {
        status: 200,
        message: "Successful",
        data: { post },
      });
    }
  } catch (e) {
    console.log("[getPost]", e.message);
  }

  return createError(res, {
    code: 404,
    args: ["The post you are looking for doesnt exist"],
  });
};
