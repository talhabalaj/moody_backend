import env from "dotenv";

env.config();

export const secret = process.env.SECRET || "";
export const port = process.env.PORT || "";
export const mongoUrl = process.env.MONGO_URL || "";
export const sessionTime = parseInt(process.env.SESSION_TIME || "86400");
export const origin = process.env.ORIGIN || "";
export const cloudinaryUrl = process.env.CLOUDINARY_URL || "";
export const mailboxlayerApi = process.env.MAILBOXLAYER_API_KEY || "";
export const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || "";
export const privateKey = process.env.FIREBASE_PRIVATE_KEY || "";
export const projectId = process.env.FIREBASE_PROJECT_ID || "";
