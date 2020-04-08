import mongoose, { Document, Model } from 'mongoose';
import { IUser } from './User';

interface IAuthTokenSchema extends Document {
    user: IUser['_id'],
    token: string,
    isValid: boolean
};

export interface IAuthToken extends IAuthTokenSchema { }
export interface IAuthTokenWithUser extends IAuthToken {
    user: IUser,
}
export interface IAuthTokenModel extends Model<IAuthToken> { }

const authTokenSchema = new mongoose.Schema<IAuthToken>({
    userId: mongoose.Schema.Types.ObjectId,
    token: {
        type: String
    },
    isValid: Boolean
}, { timestamps: true })

export const AuthToken = mongoose.model<IAuthToken, IAuthTokenModel>('AuthToken', authTokenSchema);