import env from "dotenv";

env.config();

export const secret = process.env.SECRET || "";
export const port = process.env.PORT || "";
export const mongoUrl = process.env.MONGO_URL || "";
export const sessionTime = parseInt(process.env.SESSION_TIME || "86400");
export const origin = process.env.ORIGIN || "";
export const cloudinaryUrl = process.env.CLOUDINARY_URL || "";
export const mailboxlayerApi = process.env.MAILBOXLAYER_API_KEY || "";
