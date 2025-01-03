import bcrypt from "bcryptjs"

const SALT_ROUNDS = 10;

export const hashPassword = async(password: string): Promise<string> => {
    return await bcrypt.hash(password, SALT_ROUNDS)
}