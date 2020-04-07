import { hash } from "bcrypt";

export const hashPassword = async (password: string) => await hash(password, 12);