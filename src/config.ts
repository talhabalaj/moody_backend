import env from 'dotenv';

env.config();

export const secret = process.env.SECRET || '';
export const port = process.env.PORT || '';
export const mongoUrl = process.env.MONGO_URL || '';
export const sessionTime = parseInt(process.env.SESSION_TIME || '86400');