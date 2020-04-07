import { Response } from 'express';

import { ExpressRequest } from "../../enhancements/ExpressRequest";
import { AuthToken } from "../../models/AuthToken";
import { User } from "../../models/User";

export const logoutUser = async (req: ExpressRequest, res: Response) => {
    const { user } = req;
    const userInfo = await User.findOne({ userName: user?.userName });
    if (userInfo) {
        const authInfo = await AuthToken.updateOne({ userId: userInfo._id }, { isValid: false });
        res.json({
            error: false,
            message: 'Successfully logged out',
        });
    }

    res.status(500).json({ error: true, message: 'userInfo wasn\'t found' })
}