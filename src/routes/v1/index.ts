import { Router } from "express";
import { feedRouter } from "./feed";
import { messageRouter } from "./message";
import { notFoundHandler } from "./404";
import { postsRouter } from "./post";
import { userRouter } from "./user";

const mainRouter = Router();

mainRouter.use("/post", postsRouter);
mainRouter.use("/user", userRouter);
mainRouter.use("/feed", feedRouter);
mainRouter.use("/messages", messageRouter);
mainRouter.use(notFoundHandler);

export { mainRouter };
