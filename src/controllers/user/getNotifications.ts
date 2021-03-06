import { ExpressRequest } from "../../enhancements/ExpressRequest";
import { createResponse } from "../../lib/response";
import { ExpressResponse } from "../../enhancements/ExpressResponse";
import { IUser_Populated } from "../../models/User";
import { Notification } from "../../models/Notification";
import assert from "assert";

export const getNotifications = async (
  req: ExpressRequest,
  res: ExpressResponse
) => {
  assert("[getNotifications] requires req.user");
  const user: IUser_Populated = req.user as IUser_Populated;
  const notifications = await Notification.find({ for: user._id })
    .sort({
      createdAt: -1,
    })
    .populate("for")
    .populate("from")
    .populate("post")
    .populate("comment");

  return createResponse(res, {
    message: "Successful!",
    status: 200,
    data: { notifications },
  });
};
