import { Request, Response } from 'express';
import { ExpressRequest } from '../../enhancements/ExpressRequest';
import { createResponse } from '../../lib/response';

export const getUser = async (req: ExpressRequest, res: Response) => {
    const { user } = req;
    if (user) {
        createResponse(res, {
            status: 200, message: 'Successful', data: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName,
                phoneNo: user.phoneNumber || '',
            }
        });
    }
}   