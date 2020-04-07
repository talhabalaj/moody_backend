import { Request, Response, NextFunction } from 'express';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { secret } from '../config';
import { User } from '../models/User';
import { ExpressRequest } from '../enhancements/ExpressRequest';
import { logoutUser } from '../controllers/user';

interface JWTVerificationResponse {
    id: string,
    iat: number,
    exp: number,
}

export const authProvider = async (req: ExpressRequest, res: Response, next: NextFunction) => {
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
                    res.status(400).json({
                        error: true,
                        message: 'Token Expired'
                    })
                } else if (e.name === 'JsonWebTokenError') {
                    res.status(400).json({
                        error: true,
                        message: 'Token Malformed'
                    })
                }
            } else {
                console.error(e);
                res.status(500).end();
            }
        }
    } else {
        next();
    }
}

export const protectedRoute = async (req: ExpressRequest, res: Response, next: NextFunction) => {
    if (req.user) {
        next();
    } else {
        res.status(403).json({
            error: true,
            message: 'Unauthorized!'
        });
    }
}

export const loginRegisterLock = async (req: ExpressRequest, res: Response, next: NextFunction) => {
    if (req.user) {
        res.redirect('/');
    }

    next();
}