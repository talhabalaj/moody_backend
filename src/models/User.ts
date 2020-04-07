import mongoose, { Document } from 'mongoose';
import { hashPassword } from '../lib/hash';

export interface IUser {
    firstName: string,
    lastName: string,
    phoneNumber: string,
    email: string,
    userName: string,
    password: string,
};

export interface IUserDocument extends Document, IUser { }

const userSchema = new mongoose.Schema<IUser>({
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

userSchema.pre<IUserDocument>('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await hashPassword(this.password);
    }
});

export const User = mongoose.model<IUserDocument>('User', userSchema);