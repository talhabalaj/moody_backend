import cloudinary from "cloudinary";
import assert from "assert";
import DataURIParser from "datauri/parser";

import { ExpressRequest } from "../../enhancements/ExpressRequest";
import { ExpressResponse } from "../../enhancements/ExpressResponse";
import { createError } from "../../lib/errors";
import { Post } from "../../models/Post";
import { createResponse } from "../../lib/response";

export const createPost = async (req: ExpressRequest, res: ExpressResponse) => {
  assert(req.user, "[createPost] Should be routed with authenticated route.");

  // Check if files exists
  if (!req.file) {
    return createError(res, {
      code: 4000,
      args: ["An image file with format png or jpeg is allowed."],
    });
  }

  // make data uri parser
  const parser = new DataURIParser();
  // make data uri from buffer
  const file = <string>(
    parser.format(req.file.originalname, req.file.buffer).content
  );

  // get body of post
  const { caption = "" } = req.body;

  if (caption.length >= 2000) {
    return createError(res, {
      code: 4000,
      args: ["The caption is way too large"],
    });
  }

  try {
    // upload to cloudinary
    const uploaded = await cloudinary.v2.uploader.upload(file, {
      transformation: {
        height: 1080,
        quality: "auto:best",
        crop: "scale",
      },
    });

    // save to database
    const post = await Post.create({
      imageUrl: uploaded.secure_url,
      user: req.user ? req.user._id : null,
      caption,
    });

    // Success response
    return createResponse(res, {
      status: 200,
      data: { post },
      message: "Successfully posted.",
    });
  } catch (e) {
    return createError(res, {
      code: 4000,
      args: ["There was an error in uploading the file."],
    });
  }
};
