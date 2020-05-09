import { Router } from "express";
import multer from "multer";
import { authProvider, protectedRoute } from "../../middleware/auth";
import { createPost } from "../../controllers/posts/createPost";
import { createError } from "../../lib/errors";
import { getPost } from "../../controllers/posts/getPost";
import { upload } from "../../middleware/update";
import { unLike, likePost } from "../../controllers/posts/likePost";
import { deletePost } from "../../controllers/posts/deletePost";

const postsRouter = Router();

postsRouter.post(
  "/create",
  authProvider,
  protectedRoute,
  (req, res, next) => {
    upload(req, res, (err: Error) => {
      if (err instanceof multer.MulterError) {
        return createError(res, { code: 4000, args: [err.message] });
      }
      return next();
    });
  },
  createPost
);

postsRouter.get("/:postId", authProvider, protectedRoute, getPost);
postsRouter.delete("/:postId", authProvider, protectedRoute, deletePost);
// postsRouter.put('/:postId', authProvider, protectedRoute, updatePost);
postsRouter.get("/:postId/like", authProvider, protectedRoute, likePost);
postsRouter.get("/:postId/unlike", authProvider, protectedRoute, unLike);
// postsRouter.post("/:postId/comment", authProvider, protectedRoute, () => {});

export { postsRouter };
