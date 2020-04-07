import { Request } from 'express';
import { IUser } from '../models/User';

export interface ExpressRequest extends Request {
    user?: IUser
}