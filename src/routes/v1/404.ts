import { createError } from "../../lib/errors";
import { ExpressRequest } from "../../enhancements/ExpressRequest";
import { ExpressResponse } from "../../enhancements/ExpressResponse";

export const notFoundHandler = (req: ExpressRequest, res: ExpressResponse) => createError(res, { code: 404, args: [req.method] });