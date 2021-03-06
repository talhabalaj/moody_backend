import { Response } from "express";
import { WebServerResponseError } from "./response";

type errorArgs = (args?: string[]) => WebServerResponseError;

export const createError = (
  res: Response,
  { code, args = [] }: { code: number; args?: string[] }
) => {
  const find = errors.find((error) => error(args).code === code);
  let error: WebServerResponseError;
  if (find) {
    error = find(args);
  } else {
    error = {
      type: "Error",
      status: code,
      code: code,
      message: args && args[0] ? args[0] : "Operation not successful!",
    };
  }
  return res.status(error.status).json(error);
};

export const errors: Array<errorArgs> = [
  // Authentication error
  () => ({
    type: "AuthenticationError",
    code: 1000,
    message: "Token has been malformed.",
    status: 401,
  }),
  () => ({
    type: "AuthenticationError",
    code: 1001,
    message: "Token has been expired.",
    status: 401,
  }),
  () => ({
    type: "AuthenticationError",
    code: 1002,
    message: "You are not authorized to access this path.",
    status: 403,
  }),
  () => ({
    type: "AuthenticationError",
    code: 1003,
    message: "Logout is need to process this path.",
    status: 400,
  }),
  () => ({
    type: "AuthenticationError",
    code: 1004,
    message: "Username/password are incorrect.",
    status: 401,
  }),
  () => ({
    type: "AuthenticationError",
    code: 1005,
    message: "Token is not valid.",
    status: 400,
  }),
  // Server Error
  (args) => ({
    type: "ServerError",
    code: 500,
    message: args ? args[0] : "Internal server error",
    status: 500,
  }),
  // Registraton Error
  (args) => ({
    type: "RegistrationError",
    code: 2000,
    message: `User with ${
      args ? `email ${args[0]}` : "this email"
    } already exists.`,
    status: 400,
  }),
  (args) => ({
    type: "RegistrationError",
    code: 2001,
    message: `User with ${
      args ? `username ${args[0]}` : "this username"
    } already exists.`,
    status: 400,
  }),
  (args) => ({
    type: "RegistrationError",
    code: 2002,
    message: args ? args[0] : "Invalid data",
    status: 400,
  }),
  // Request Error
  (args) => ({
    type: "RequestError",
    code: 404,
    message: args ? args[0] : "404 not found.",
    status: 404,
  }),
  // Update Error
  () => ({
    type: "UpdateError",
    code: 3000,
    message: `No fields to update`,
    status: 400,
  }),
  // Post Errors,
  (args) => ({
    type: "PostingError",
    code: 4000,
    message: `${args && args[0]}`,
    status: 400,
  }),
];
