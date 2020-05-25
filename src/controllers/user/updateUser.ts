import DataURIParser from "datauri/parser";
import cloudinary from "cloudinary";

import { ExpressRequest } from "../../enhancements/ExpressRequest";
import { ExpressResponse } from "../../enhancements/ExpressResponse";
import { createResponse } from "../../lib/response";
import { createError } from "../../lib/errors";

export const updateUser = async (req: ExpressRequest, res: ExpressResponse) => {
  const { bio, firstName, lastName } = req.body;
  const { file } = req;
  const fieldsToUpdate: any = {};

  if (bio) fieldsToUpdate.bio = bio;
  if (firstName) fieldsToUpdate.firstName = firstName;
  if (lastName) fieldsToUpdate.lastName = lastName;
  if (file) {
    // make data uri parser
    const parser = new DataURIParser();
    // make data uri from buffer
    const file = <string>(
      parser.format(req.file.originalname, req.file.buffer).content
    );

    const uploaded = await cloudinary.v2.uploader.upload(file, {
      transformation: {
        transformation: {
          height: 1080,
          quality: "auto:best",
          crop: "scale",
        },
      },
    });
    fieldsToUpdate.profilePicUrl = uploaded.secure_url;
  }

  if (!Object.keys(fieldsToUpdate).length) {
    return createError(res, { code: 3000 });
  }

  try {
    const { user } = req;
    await user?.updateOne(fieldsToUpdate);
    return createResponse(res, {
      status: 200,
      message: "Successfully updated user.",
      data: { updatedFields: fieldsToUpdate },
    });
  } catch (e) {
    return createError(res, { code: 500, args: [e.message] });
  }
};
