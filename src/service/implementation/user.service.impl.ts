import { User } from "@prisma/client";
import { CreateUserDTO } from "../../dto/createUser.dto";
import { UserService } from "../user-service";
import { CustomError } from "../../exceptions/customError.error";
import { db } from "../../config/db";
import { hashPassword } from "../../utils/password.util";


export class UserServiceImpl implements UserService{
    async createUser(data: CreateUserDTO): Promise<User> {
        const isUserExist = await db.user.findFirst({
            where: {
                email: data.email,
            },
        });

        if(isUserExist){
            throw new CustomError(409, "Oops email already taken");
        }

        const user = await db.user.create({
            data: {
                email: data.email,
                password: await hashPassword(data.password),
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role,
            },
        })
        return user;
    }

    async getUserById(id: number): Promise<User | null> {

         const user = await db.user.findUnique({
            where: { id },
        })
        if(!user){
            throw new CustomError(404, `User with ${id} does not exist`)
        }
        return user
    }

    async getAllUsers(): Promise<User[]> {
        return await db.user.findMany();
    }

    async updateUser(id: number, data: Partial<CreateUserDTO>): Promise<User> {
        const isUserExist = await db.user.findFirst({
            where: {
                id,  //id: id
            },
        });
        if(!isUserExist){
            throw new CustomError(404, `User with ${id} does not exist`)
        }
        const user = await db.user.update({
            where: { id },
            data,
        });
        return user;
    }

    async deleteUser(id: number): Promise<void> {
        await db.user.delete({
            where: { id },
        });
    }
}