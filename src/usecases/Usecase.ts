import { PrismaClient } from "@prisma/client";
import { PostUsecase } from "./PostUsercase";
import { UserUsecase } from "./UserUsecase";

export class Usecase {
    private userUsecase: UserUsecase;
    private postUsecase: PostUsecase;

    constructor(repo: PrismaClient) {
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
