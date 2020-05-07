import { ExpressRequest } from "../../enhancements/ExpressRequest";
import { createResponse } from "../../lib/response";
import { ExpressResponse } from "../../enhancements/ExpressResponse";
import { User, IUser } from "../../models/User";
import { createError } from "../../lib/errors";
import { Post } from "../../models/Post";

export const getUser = async (req: ExpressRequest, res: ExpressResponse) => {
  let { user } = req;
  const { userName } = req.params;

  let userToGet: IUser | undefined = user;

  if (userName)
    userToGet =
      (await User.findOne({ userName })
        .select("+followerCount +followingCount +bio +followers +following")
        .populate("followers")
        .populate("following")) || undefined;

  if (userToGet) {
    return createResponse(res, {
      status: 200,
      message: "Successfully fetched.",
      data: {
        user: userToGet,
      },
    });
  } else
    return createError(res, {
      code: 404,
      args: [`User with username "${userName}" is not found`],
    });
};
