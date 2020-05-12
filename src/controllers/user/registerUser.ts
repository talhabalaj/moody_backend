import { User } from "../../models/User";
import { ExpressRequest } from "../../enhancements/ExpressRequest";
import { createError } from "../../lib/errors";
import { createResponse } from "../../lib/response";
import { ExpressResponse } from "../../enhancements/ExpressResponse";
import { verifyEmail } from "../../lib/verify-email";

export const registerUser = async (
  req: ExpressRequest,
  res: ExpressResponse
) => {
  let {
    userName,
    email,
    password,
    phoneNumber,
    firstName,
    lastName,
  } = req.body;

  if (await User.exists({ email })) {
    return createError(res, { code: 2000, args: [email] });
  }

  if (await User.exists({ userName })) {
    return createError(res, { code: 2001, args: [userName] });
  }

  if (!(await verifyEmail(email))) {
    return createError(res, { code: 2002, args: ["Email is not valid"] });
  }

  try {
    const user = new User({
      userName,
      email,
      password,
      phoneNumber,
      firstName,
      lastName,
    });
    await user.save();
    return createResponse(res, {
      status: 201,
      message: "Successfully created user.",
    });
  } catch (e) {
    return createError(res, { code: 2002, args: [e.message] });
  }
};

export const checkUserName = async (
  req: ExpressRequest,
  res: ExpressResponse
): Promise<ExpressResponse<any>> => {
  if (await User.exists({ userName: req.body.userName })) {
    return createResponse(res, {
      status: 200,
      message: "The user is not available.",
      data: { valid: false },
    });
  }

  return createResponse(res, {
    status: 200,
    message: "The username is available.",
    data: { valid: true },
  });
};

export const checkEmail = async (
  req: ExpressRequest,
  res: ExpressResponse
): Promise<ExpressResponse<any>> => {
  if (await User.exists({ email: req.body.email })) {
    return createResponse(res, {
      status: 200,
      message: "The email is not available.",
      data: { valid: false },
    });
  }

  return createResponse(res, {
    status: 200,
    message: "The email is available.",
    data: { valid: true },
  });
};
