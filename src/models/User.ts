import mongoose, { Document, Model } from 'mongoose';
import { hashPassword } from '../lib/hash';

interface IUserSchema extends Document {
    firstName: string,
    lastName: string,
    phoneNumber?: string,
    email: string,
    userName: string,
    password: string,
};

export interface IUser extends IUserSchema {
    fullName: string,
}

export interface IUserModel extends Model<IUser> { }

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 1
    },
    lastName: {
        type: String,
        required: true,
        minlength: 1
    },
    phoneNumber: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        match: /[A-z-a-z-0-9]*/
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
}, { timestamps: true })

userSchema.pre<IUser>('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await hashPassword(this.password);
    }
});

userSchema.virtual('fullName').get(function (this: IUser) {
    return `${this.firstName} ${this.lastName}`;
})

export const User = mongoose.model<IUser, IUserModel>('User', userSchema);