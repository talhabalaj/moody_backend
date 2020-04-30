import { Router } from "express";
import multer from "multer";
import { authProvider, protectedRoute } from "../../middleware/auth";
import { createPost } from "../../controllers/posts/createPost";
import { createError } from "../../lib/errors";

const postsRouter = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const isImage = /image\/(png|jpeg|jpg)/g.test(file.mimetype);
    if (isImage) cb(null, true);
    else cb(null, false);
  },
  limits: {
    fileSize: 2500000,
  },
}).single("image");

postsRouter.post(
  "/create",
  authProvider,
  protectedRoute,
  (req, res, next) => {
    // @ts-ignore
    upload(req, res, (err: Error) => {
      if (err instanceof multer.MulterError) {
        return createError(res, { code: 4000, args: [err.message] });
      }
      return next();
    });
  },
  createPost
);

export { postsRouter };
