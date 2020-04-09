import { ExpressRequest } from "../../enhancements/ExpressRequest";
import { ExpressResponse } from "../../enhancements/ExpressResponse";
import { createResponse } from "../../lib/response";
import { createError } from "../../lib/errors";

export const updateUser = async (req: ExpressRequest, res: ExpressResponse) => {
    const { phoneNumber, firstName, lastName } = req.body;
    const fieldsToUpdate: any = {};

    if (phoneNumber) fieldsToUpdate.phoneNumber = phoneNumber;
    if (firstName) fieldsToUpdate.firstName = firstName;
    if (lastName) fieldsToUpdate.lastName = lastName;

    if (!Object.keys(fieldsToUpdate).length) {
        return createError(res, { code: 3000 });
    }

    try {
        const { user } = req;
        await user?.updateOne(fieldsToUpdate);
        return createResponse(res, { status: 200, message: 'Successfully updated user.', data: { updatedFields: fieldsToUpdate } });
    }
    catch (e) {
        return createError(res, { code: 500, args: [e.message] });
    }
}