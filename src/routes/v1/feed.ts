import { Router } from "express";
import { authProvider, protectedRoute } from "../../middleware/auth";
import { feed } from "../../controllers/posts/feed";

const feedRouter = Router();

feedRouter.get("/", authProvider, protectedRoute, feed);

export { feedRouter };
