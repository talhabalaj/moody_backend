import { Router } from "express";
import { userRouter } from "./user";
import { notFoundHandler } from "./404";
import { postsRouter } from "./posts";

const mainRouter = Router();

mainRouter.use("/user", userRouter);
mainRouter.use("/posts", postsRouter);
mainRouter.use(notFoundHandler);

export { mainRouter };
