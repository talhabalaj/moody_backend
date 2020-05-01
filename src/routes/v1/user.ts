import { Router } from "express";

import {
  registerUser,
  checkUserName,
  checkEmail,
} from "./../../controllers/user/registerUser";
import {
  protectedRoute,
  authProvider,
  loginRegisterLock,
} from "../../middleware/auth";
import { followUser, unfollowUser } from "../../controllers/user/followUser";
import { loginUser } from "../../controllers/user/loginUser";
import { logoutUser } from "../../controllers/user/logoutUser";
import { getUser } from "../../controllers/user/getUser";
import { updateUser } from "../../controllers/user/updateUser";

const userRouter = Router();

userRouter.post("/register", authProvider, loginRegisterLock, registerUser);
userRouter.post("/check-user", authProvider, loginRegisterLock, checkUserName);
userRouter.post("/check-email", authProvider, loginRegisterLock, checkEmail);
userRouter.post("/login", authProvider, loginRegisterLock, loginUser);

userRouter.get("/logout", authProvider, protectedRoute, logoutUser);
userRouter.get("/profile/:userName?", authProvider, protectedRoute, getUser);
userRouter.get(
  "/profile/:userName/follow",
  authProvider,
  protectedRoute,
  followUser
);
userRouter.get(
  "/profile/:userName/unfollow",
  authProvider,
  protectedRoute,
  unfollowUser
);
userRouter.put("/profile", authProvider, protectedRoute, updateUser);

export { userRouter };
