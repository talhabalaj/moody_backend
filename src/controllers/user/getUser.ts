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
    return createResponse(res, {
      status: 200,
      message: "Successfully fetched.",
      data: {
        user,
      },
    });
  } else
    return createError(res, {
      code: 404,
      args: [`User with username "${userName}" is not found`],
    });
};
