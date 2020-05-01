import { Response } from "express";

export interface WebServerResponse {
  status: number;
  message: string;
  data?: Object;
}

export interface WebServerResponseError extends WebServerResponse {
  type: string;
  code: number;
}

export const createResponse = (res: Response, data: WebServerResponse) =>
  res.status(data.status).json(data);
