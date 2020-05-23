import { ExpressRequest } from "../enhancements/ExpressRequest";
import { ExpressResponse } from "../enhancements/ExpressResponse";
import { NextFunction } from "express";
import validator from "validator";

export const escapeBody = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      const value = req.body[key];
      if (value) {
        if (typeof value == "string") req.body[key] = validator.escape(value);
      }
    });
  }

  next();
};
