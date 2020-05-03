import { ExpressRequest } from "../../enhancements/ExpressRequest";
import { createResponse } from "../../lib/response";
import { ExpressResponse } from "../../enhancements/ExpressResponse";
import { User } from "../../models/User";
import { createError } from "../../lib/errors";
import { Post } from "../../models/Post";

export const getUser = async (req: ExpressRequest, res: ExpressResponse) => {
  let { user } = req;
  const { userName } = req.params;

  if (userName)
    user =
      (await User.findOne({ userName }).select(
        "+followerCount +followingCount +bio +followers +following"
      )) || undefined;

  if (user) {
    const posts = await Post.find({ user: user._id });

    return createResponse(res, {
      status: 200,
      message: "Successfully fetched.",
      data: {
        user: {
          fullName: user.fullName,
          followerCount: user.followerCount,
          followingCount: user.followingCount,
          bio: user.bio,
          posts,
        },
      },
    });
  } else
    return createError(res, {
      code: 404,
      args: [`User with username "${userName}" is not found`],
    });
};
