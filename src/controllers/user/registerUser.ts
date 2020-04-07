import { Request, Response } from "express";

import { User, IUser } from "../../models/User";

import "../../lib/db";
import { ExpressRequest } from "../../enhancements/ExpressRequest";

export const registerUser = async (req: ExpressRequest, res: Response) => {

    const { userName, email, password, phoneNumber, firstName, lastName }: IUser = req.body;


    if (await User.exists({ email })) {
        return res.status(400).json({
            error: true,
            message: `User with email '${email}' already exists.`
        });
    }

    if (await User.exists({ userName })) {
        return res.status(400).json({
            error: true,
            message: `User with user name '${userName}' already exists.`
        })
    }


    try {
        const user = new User({ userName, email, password, phoneNumber, firstName, lastName });

        await user.save();

        return res.status(201).json({
            error: false,
            message: 'Successfully created!'
        })

    } catch (e) {
        return res.status(400).json({
            error: true,
            message: e.message,
        })
    }

}

export const checkUserName = async (req: Request, res: Response): Promise<Response<any>> => {
    if (await User.exists({ userName: req.body.userName })) {
        return res.json({
            error: true,
            message: `User already exists.`
        })
    }

    return res.json({
        error: false,
        message: 'The username is available.',
    })
}

export const checkEmail = async (req: Request, res: Response): Promise<Response<any>> => {
    if (await User.exists({ email: req.body.email })) {
        return res.json({
            error: true,
            message: `Email already exists.`
        })
    }

    return res.json({
        error: false,
        message: 'The email is available.',
    })
}

