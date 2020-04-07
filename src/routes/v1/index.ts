import { Router } from 'express';
import { userRouter } from './user';
import { registerUser } from '../../controllers/user';

const mainRouter = Router();

mainRouter.use('/user', userRouter);

export { mainRouter };