import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { AuthToken } from "../../models/AuthTokens";
import { User } from "../../models/User";
import { secret, sessionTime } from '../../config';
import { compare } from 'bcrypt';


export const loginUser = async (req: Request, res: Response): Promise<Response<any>> => {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    if (user && await compare(password, user.password)) {
        const token = jwt.sign({ id: user._id }, secret, { expiresIn: sessionTime });
        const authToken = new AuthToken({ userId: user._id, token, expiresAt: Date.now() + sessionTime });
        try {
            await authToken.save();

            return res.status(202).json({
                error: false,
                token,
            });

        } catch (e) {
            return res.status(500).json(
                {
                    error: true,
                    message: e.message
                }
            )
        }
    } else {
        return res.status(400).json(
            {
                error: true,
                message: 'Email/password are incorrect.'
            }
        )
    }

}
