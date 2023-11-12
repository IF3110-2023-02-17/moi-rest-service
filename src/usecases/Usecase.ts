import { PrismaClient } from "@prisma/client";
import { UserUsecase } from "./UserUsecase";
import { Client } from "../clients/Client";

export class Usecase {
    private userUsecase: UserUsecase;

    constructor(repo: PrismaClient, client: Client) {
        this.userUsecase = new UserUsecase(repo);
    }

    get user() {
        return this.userUsecase;
    }
}
