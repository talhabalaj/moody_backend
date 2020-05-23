import { INotification, UserNotificationType } from "../models/Notification";
import { admin } from "firebase-admin/lib/messaging";
import { User } from "../models/User";
import { IPost, Post } from "../models/Post";

export const buildNotification = async (
  notification: INotification
): Promise<admin.messaging.NotificationMessagePayload> => {
  let body = "";

  const user = await User.findById(notification.from);

  switch (notification.type) {
    case UserNotificationType.POST_COMMENTED:
      body = `${notification.for} commented on your post.`;
      break;
    case UserNotificationType.POST_LIKED:
      body = `${notification.for} liked your post.`;
      break;
    case UserNotificationType.USER_FOLLOWED:
      body = `${notification.for} followed your post.`;
      break;
    default:
      body = `${notification.for} performed a unknown activity.`;
      break;
  }

  return {
    body: body,
  };
};
