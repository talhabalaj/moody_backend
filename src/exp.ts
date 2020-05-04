import "./lib/db";
import { AuthToken, IAuthTokenWithUser } from "./models/AuthToken";
import { User } from "./models/User";
import { Post } from "./models/Post";
import { Comment } from "./models/Comment";

async function main() {
  const user = await User.findOne({ userName: "talhabalaj" });
  user && user.unfollow("talha");
}

main().catch((e: Error) => console.error(e.message));
