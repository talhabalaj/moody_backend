import { ExpressRequest } from "../../enhancements/ExpressRequest";
import { createResponse } from "../../lib/response";
import { ExpressResponse } from "../../enhancements/ExpressResponse";
import { IUser_Populated } from "../../models/User";
import { Notification } from "../../models/Notification";
import assert from "assert";
import { createError } from "../../lib/errors";
import { Types, isValidObjectId } from "mongoose";
import { isArray } from "util";

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

export const markNotificationSoftRead = async (
  req: ExpressRequest,
  res: ExpressResponse
) => {
  assert("[markNotificationRead] requires req.user");
  const { ids } = req.body;
  if (ids && isArray(ids) && ids.length > 0) {
    const objectIds = ids.filter((id: string) => isValidObjectId(id));

    const filterdIdsforCurrentUser = await Notification.find({
      _id: { $in: objectIds },
    });

    await Notification.updateMany(
      { _id: { $in: filterdIdsforCurrentUser } },
      { softRead: true }
    );

    return createResponse(res, {
      message: "Successful!",
      status: 200,
    });
  } else {
    return createError(res, { code: 400 });
  }
};
