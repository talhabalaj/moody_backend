import { Router } from "express";
import { userRouter } from "./user";
import { notFoundHandler } from "./404";
import { postsRouter } from "./post";
import { feedRouter } from "./feed";
import { messageRouter } from "./message";

const mainRouter = Router();

mainRouter.use("/user", userRouter);
mainRouter.use("/post", postsRouter);
mainRouter.use("/feed", feedRouter);
mainRouter.use("/messages", messageRouter);
mainRouter.use(notFoundHandler);

export { mainRouter };
