import { Router } from 'express';

import { loginUser, logoutUser } from '../../controllers/user';
import { getUser } from '../../controllers/user';
import { registerUser, checkUserName } from './../../controllers/user/registerUser';
import { protectedRoute, authProvider, loginRegisterLock } from '../../middleware/auth';
import { updateUser } from '../../controllers/user';

const userRouter = Router();

userRouter.post('/register', authProvider, loginRegisterLock, registerUser);
userRouter.post('/check-user', authProvider, loginRegisterLock, checkUserName);
userRouter.post('/login', authProvider, loginRegisterLock, loginUser);

userRouter.get('/logout', authProvider, protectedRoute, logoutUser);
userRouter.get('/profile', authProvider, protectedRoute, getUser);
userRouter.put('/profile', authProvider, protectedRoute, updateUser);


export { userRouter };