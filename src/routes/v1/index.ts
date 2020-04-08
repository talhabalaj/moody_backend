import { Router } from 'express';
import { userRouter } from './user';
import { notFoundHandler } from './404';

const mainRouter = Router();

mainRouter.use('/user', userRouter);
mainRouter.use(notFoundHandler);

export { mainRouter };