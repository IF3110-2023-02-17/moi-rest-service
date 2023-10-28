import { PrismaClient } from "@prisma/client";
import { UserUsecase } from "./UserUsecase";

export class Usecase {
    private userUsecase: UserUsecase;

    constructor(repo: PrismaClient) {
        this.userUsecase = new UserUsecase(repo);
    }

    get user() {
        return this.userUsecase;
    }
}
