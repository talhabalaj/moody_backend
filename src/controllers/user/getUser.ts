import { Request, Response } from 'express';
import { ExpressRequest } from '../../enhancements/ExpressRequest';

export const getUser = async (req: ExpressRequest, res: Response) => {
    const { user } = req;
    if (user) {
        const { userName, email, firstName, lastName } = user;
        res.json({
            error: false,
            data: {
                userName, email, firstName, lastName
            }
        })
    }
}   