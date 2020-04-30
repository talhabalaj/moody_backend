import "./lib/db";
import { AuthToken, IAuthTokenWithUser } from "./models/AuthToken";
import { User } from "./models/User";
import { Post } from "./models/Post";
import { Comment } from "./models/Comment";

async function main() {
  const user = await User.findOne({ userName: "talhabalaj" });
  console.log(user);

  // try {
  //   const what = await Post.updateOne(
  //     { imageUrl: "justAnotherString" },
  //     { user: user?._id }
  //   );
  //   if (!what.nModified) {
  //     console.log("Not modified");
  //   }
  // } catch (e) {
  //   console.log(e);
  // }
  const post = await Post.findOne({ user: user?._id });
  const comment = await Comment.create({
    post: post?._id,
    user: user?._id,
    message: "Great Post",
  });
  comment.save();
  // const comments = post?.comments;
  // comments?.push(comment._id);
  // post?.updateOne({ comments });
  // post?.save();
  console.log(post);

  // const authToken: IAuthTokenWithUser | null = await AuthToken.findOne({
  //   token: "string",
  // }).populate("user");
  // console.log(authToken);
}

main().catch((e: Error) => console.error(e.message));
