import { ExpressRequest } from "../../enhancements/ExpressRequest";
import { ExpressResponse } from "../../enhancements/ExpressResponse";
import assert from "assert";
import { createError } from "../../lib/errors";
import { createResponse } from "../../lib/response";
import { User } from "../../models/User";

export const followUser = async (req: ExpressRequest, res: ExpressResponse) => {
  const { user } = req;
  assert(user, "[followUser] requires req.user to exist");

  const { userName } = req.params;

  try {
    const modified = await user?.addFollower(userName);
    return createResponse(res, {
      status: 200,
      message: "Successfull",
      data: { modified },
    });
  } catch (e) {
    return createError(res, { code: 404, args: [e.message] });
  }
};

export const unfollowUser = async (
  req: ExpressRequest,
  res: ExpressResponse
) => {
  const { user } = req;
  assert(user, "[unfollowUser] requires req.user to exist");

  const { userName } = req.params;

  try {
    const userToUnfollow = await User.findOne({ userName });
    if (!userToUnfollow)
      return createError(res, { code: 404, args: ["User not found"] });
    let modified = false;
    if (user) modified = await userToUnfollow.removeFollower(user?.userName);
    return createResponse(res, {
      status: 200,
      message: "Successfull",
      data: { modified },
    });
  } catch (e) {
    return createError(res, { code: 404, args: [e.message] });
  }
};
