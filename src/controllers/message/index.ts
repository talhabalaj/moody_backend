import assert from "assert";

import { ExpressRequest } from "../../enhancements/ExpressRequest";
import { ExpressResponse } from "../../enhancements/ExpressResponse";
import { Conversation } from "../../models/Conversation";
import { User } from "../../models/User";
import { createError } from "../../lib/errors";
import { createResponse } from "../../lib/response";
import { Message } from "../../models/Message";

export const createConvo = async (
  req: ExpressRequest,
  res: ExpressResponse
) => {
  assert(req.user, "[createConvo] requires req.user");
  const { to } = req.params;
  const recUser = await User.findById(to);

  if (recUser) {
    let conversation = await Conversation.findOne({
      members: { $elemMatch: { $in: [to, req.user?.id] } },
    }).populate("members");
    if (!conversation)
      conversation = (
        await Conversation.create({
          members: [req.user?._id, recUser._id],
        })
      ).populate("members");

    return createResponse(res, {
      status: 200,
      message: "Successful",
      data: { conversation },
    });
  } else {
    return createError(res, { code: 404, args: ["User not found."] });
  }
};

export const getConversations = async (
  req: ExpressRequest,
  res: ExpressResponse
) => {
  assert(req.user, "[getConversations] requires req.user");
  const conversations = await Conversation.find({
    members: { $elemMatch: { $eq: req.user?._id } },
  }).populate("members");

  return createResponse(res, {
    status: 200,
    message: "Successful",
    data: { conversations },
  });
};

export const getMessages = async (
  req: ExpressRequest,
  res: ExpressResponse
) => {
  assert(req.user, "[getConversations] requires req.user");
  const { conversationId } = req.params;
  const offset = !!req.query.offset ? +req.query.offset : 0;

  const messages = await Message.find({ conversation: conversationId })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(10)
    .populate({
      path: "conversation",
      populate: {
        path: "members",
        model: "User",
      },
    })
    .populate("from");

  return createResponse(res, {
    status: 200,
    message: "Successful",
    data: { messages },
  });
};
