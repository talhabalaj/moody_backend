import { registerUser, checkUserName, checkEmail } from './../../controllers/user/registerUser';
import { Router } from 'express';
import { loginUser } from '../../controllers/user/loginUser';

const userRouter = Router();

userRouter.post('/register', registerUser);
userRouter.post('/check-user', checkUserName);
userRouter.post('/check-email', checkEmail);
userRouter.post('/login', loginUser);

export { userRouter };