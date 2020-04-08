import { Request, Response } from "express";

import { User, IUser } from "../../models/User";
import { ExpressRequest } from "../../enhancements/ExpressRequest";
import { createError } from "../../lib/errors";
import { createResponse } from "../../lib/response";

export const registerUser = async (req: ExpressRequest, res: Response) => {
    const { userName, email, password, phoneNumber, firstName, lastName }: IUser = req.body;

    if (await User.exists({ email })) {
        return createError(res, { code: 2000, args: [email] })
    }

    if (await User.exists({ userName })) {
        return createError(res, { code: 2001, args: [userName] })
    }

    try {
        const user = new User({ userName, email, password, phoneNumber, firstName, lastName });
        await user.save();
        return createResponse(res, { status: 201, message: 'Successfully created user.' });
    } catch (e) {
        return createError(res, { code: 2002, args: [e.message] })
    }
}

export const checkUserName = async (req: Request, res: Response): Promise<Response<any>> => {
    if (await User.exists({ userName: req.body.userName })) {
        return createResponse(res, { status: 200, message: 'The user is not available.', data: { valid: false } });
    }

    return createResponse(res, { status: 200, message: 'The username is available.', data: { valid: true } });
}

export const checkEmail = async (req: Request, res: Response): Promise<Response<any>> => {
    if (await User.exists({ email: req.body.email })) {
        return createResponse(res, { status: 200, message: 'The email is not available.', data: { valid: false } });
    }

    return createResponse(res, { status: 200, message: 'The email is available.', data: { valid: true } });
}

