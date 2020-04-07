import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { compare } from 'bcrypt';

import { AuthToken } from "../../models/AuthToken";
import { User } from "../../models/User";
import { secret, sessionTime } from '../../config';
import { ExpressRequest } from '../../enhancements/ExpressRequest';


export const loginUser = async (req: ExpressRequest, res: Response): Promise<Response<any>> => {

    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    if (user && await compare(password, user.password)) {
        const token = jwt.sign({ id: user._id }, secret, { expiresIn: sessionTime });
        const authToken = new AuthToken({ userId: user._id, token, isValid: true });
        try {
            await authToken.save();
            return res.status(202).json({
                error: false,
                token,
            });
        } catch (e) {
            return res.status(500).json({
                error: true,
                message: e.message
            });
        }
    } else {
        return res.status(400).json({
            error: true,
            message: 'Email/password are incorrect.'
        });
    }

}
