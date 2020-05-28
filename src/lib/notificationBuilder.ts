import { INotification, UserNotificationType } from "../models/Notification";
import { admin } from "firebase-admin/lib/messaging";
import { User } from "../models/User";
import { IPost, Post } from "../models/Post";

export const buildNotification = async (
  notification: INotification
): Promise<admin.messaging.MessagingPayload> => {
  let body = "";
  let args = {};

  const user = await User.findById(notification.from);

  switch (notification.type) {
    case UserNotificationType.POST_COMMENTED:
      body = `${user?.userName || "A user"} commented on your post.`;
      args = { post_id: notification.post, comment_id: notification.comment };
      break;
    case UserNotificationType.POST_LIKED:
      body = `${user?.userName || "A user"} liked your post.`;
      args = { post_id: notification.post };
      break;
    case UserNotificationType.USER_FOLLOWED:
      body = `${user?.userName || "A user"} started following you.`;
      args = { user_id: user?._id };
      break;
    default:
      body = `${user?.userName || "A user"} performed a unknown activity.`;
      break;
  }

  return {
    notification: { body: body },
    data: {
      click_action: "FLUTTER_NOTIFICATION_CLICK",
      ...args,
    },
  };
};
