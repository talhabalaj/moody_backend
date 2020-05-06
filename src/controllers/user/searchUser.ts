import { ExpressRequest } from "../../enhancements/ExpressRequest";
import { ExpressResponse } from "../../enhancements/ExpressResponse";
import { createResponse } from "../../lib/response";
import { createError } from "../../lib/errors";
import assert from "assert";
import { User, IUser } from "../../models/User";

export const searchUser = async (req: ExpressRequest, res: ExpressResponse) => {
  assert(req.user, "[searchUser] must be called with req.user");

  const { q, skip } = req.query;
  let users: IUser[] = [];
  if (q) {
    users = await User.find({
      $or: [
        { userName: { $regex: <string>q, $options: "i" } },
        { fullName: { $regex: <string>q, $options: "i" } },
      ],
    })
      .limit(10)
      .skip(skip ? parseInt(<string>skip) : 0);
  }
  return createResponse(res, {
    message: "Successful",
    status: 200,
    data: { users },
  });
};
