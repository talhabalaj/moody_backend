import { Response, NextFunction } from 'express';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { secret } from '../config';
import { User } from '../models/User';
import { ExpressRequest } from '../enhancements/ExpressRequest';
import { createError } from '../lib/errors';
import { AuthToken } from '../models/AuthToken';


interface JWTVerificationResponse {
    id: string,
    iat: number,
    exp: number,
}

export const authProvider = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<any> => {

    let token = req.cookies['access_token'];

    if (token) {
        try {
            const tokenInfo = await AuthToken.findOne({ token });
            if (tokenInfo?.isValid) {
                const { id } = jwt.verify(token, secret) as JWTVerificationResponse;
                const user = await User.findById(id);
                if (user) {
                    req.user = user;
                    req.token = tokenInfo;
                }
            } else {
                return createError(res, { code: 1005 });
            }
        } catch (e) {
            if (e instanceof JsonWebTokenError) {
                if (e.name === 'TokenExpiredError') {
                    return createError(res, { code: 1001 });
                } else if (e.name === 'JsonWebTokenError') {
                    return createError(res, { code: 1000 });
                }
            } else {
                return createError(res, { code: 500, args: [e.message] });
            }
        }
    }

    next();
}

export const protectedRoute = async (req: ExpressRequest, res: Response, next: NextFunction) => {
    if (req.user && req.token) {
        next();
    } else {
        createError(res, { code: 1002 });
    }
}

export const loginRegisterLock = async (req: ExpressRequest, res: Response, next: NextFunction) => {
    if (req.user || req.token) {
        createError(res, { code: 1003 });
    } else {
        next();
    }
}