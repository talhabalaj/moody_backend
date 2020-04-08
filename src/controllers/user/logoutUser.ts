import { Response } from 'express';

import { ExpressRequest } from "../../enhancements/ExpressRequest";
import { AuthToken } from "../../models/AuthToken";
import { User } from "../../models/User";
import { createResponse } from '../../lib/response';
import { createError } from '../../lib/errors';

export const logoutUser = async (req: ExpressRequest, res: Response) => {
    const { user } = req;
    try {
        const userInfo = await User.findOne({ userName: user?.userName });
        if (userInfo) {
            await AuthToken.updateOne({ userId: userInfo._id }, { isValid: false });
        }
    } catch (e) {
        return createError(res, { code: 5000, args: [e.message] });
    }

    return createResponse(res, { status: 200, message: 'Successfully logged out.', data: { loggedOut: true } });
}