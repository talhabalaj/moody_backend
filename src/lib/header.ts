import { ExpressResponse } from "../enhancements/ExpressResponse";

export const setDeleteServerCookieHeader = (res: ExpressResponse, name: string) =>
    res.setHeader('Set-Cookie', `${name}=deleted; expires=Thu, 01 Jan 1970 00:00:00 GMT`);