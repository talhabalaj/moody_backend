import mongoose, { Document } from 'mongoose';

export interface IAuthToken {
    userId: string,
    token: string,
    expiresAt: Date,
};

export interface IAuthTokenDocument extends Document, IAuthToken { }

const authTokenSchema = new mongoose.Schema<IAuthToken>({
    userId: mongoose.Schema.Types.ObjectId,
    token: {
        type: String
    },
    expiresAt: {
        type: Date,
    }
}, { timestamps: true })

export const AuthToken = mongoose.model<IAuthTokenDocument>('AuthToken', authTokenSchema);