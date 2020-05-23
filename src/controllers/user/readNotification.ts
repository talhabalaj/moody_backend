import { ExpressRequest } from "../../enhancements/ExpressRequest";
import { createResponse } from "../../lib/response";
import { ExpressResponse } from "../../enhancements/ExpressResponse";
import { IUser_Populated } from "../../models/User";
import { Notification } from "../../models/Notification";
import assert from "assert";
import { createError } from "../../lib/errors";

export const markNotificationRead = async (
  req: ExpressRequest,
  res: ExpressResponse
) => {
  assert("[markNotificationRead] requires req.user");
  const user: IUser_Populated = req.user as IUser_Populated;
  const { id } = req.params;

  const notification = await Notification.findOne({ _id: id, for: user._id });
  if (notification) {
    notification.read = true;
    await notification.save();

    return createResponse(res, {
      message: "Successful!",
      status: 200,
    });
  } else {
    return createError(res, {
      code: 404,
      args: ["Notification wasn't found."],
    });
  }
};
