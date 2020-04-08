import { Response, NextFunction } from 'express';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { secret } from '../config';
import { User } from '../models/User';
import { ExpressRequest } from '../enhancements/ExpressRequest';
import { createError } from '../lib/errors';


interface JWTVerificationResponse {
    id: string,
    iat: number,
    exp: number,
}

export const authProvider = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<any> => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (token) {
        try {
            const { id } = jwt.verify(token, secret) as JWTVerificationResponse;
            const user = await User.findById(id);
            if (user) {
                req.user = user;
            }
        } catch (e) {
            if (e instanceof JsonWebTokenError) {
                if (e.name === 'TokenExpiredError') {
                    // TODO: Refresh the token
                    return createError(res, { code: 1001 });
                } else if (e.name === 'JsonWebTokenError') {
                    return createError(res, { code: 1000 });
                }
            } else {
                return createError(res, { code: 5000, args: [e.message] });
            }
        }
    }

    next();
}

export const protectedRoute = async (req: ExpressRequest, res: Response, next: NextFunction) => {
    if (req.user) {
        next();
    } else {
        createError(res, { code: 1002 });
    }
}

export const loginRegisterLock = async (req: ExpressRequest, res: Response, next: NextFunction) => {
    if (req.user) {
        createError(res, { code: 1003 });
    } else {
        next();
    }
}