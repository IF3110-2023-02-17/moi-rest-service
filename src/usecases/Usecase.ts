import { PrismaClient } from "@prisma/client";
import { PostUsecase } from "./PostUsecase";
import { UserUsecase } from "./UserUsecase";
import { Client } from "../clients/Client";

export class Usecase {
    private userUsecase: UserUsecase;
    private postUsecase: PostUsecase;

    constructor(repo: PrismaClient, client: Client) {
        this.userUsecase = new UserUsecase(repo);
        this.postUsecase = new PostUsecase(repo);
    }

    get user() {
        return this.userUsecase;
    }

    get post() {
        return this.postUsecase;
    }
}
