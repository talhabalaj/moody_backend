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
      body = `${user?.userName || "A user"} commented on your post.`;
      break;
    case UserNotificationType.POST_LIKED:
      body = `${user?.userName || "A user"} liked your post.`;
      break;
    case UserNotificationType.USER_FOLLOWED:
      body = `${user?.userName || "A user"} followed your post.`;
      break;
    default:
      body = `${user?.userName || "A user"} performed a unknown activity.`;
      break;
  }

  return {
    body: body,
  };
};
