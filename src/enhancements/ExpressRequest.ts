import { Request } from "express";
import { IUser } from "../models/User";
import { IAuthToken } from "../models/AuthToken";

export interface ExpressRequest extends Request {
  user?: IUser;
  token?: IAuthToken;
}
