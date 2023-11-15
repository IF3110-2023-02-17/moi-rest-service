import { PrismaClient } from "@prisma/client";
import { PostUsecase } from "./PostUsecase";
import { UserUsecase } from "./UserUsecase";
import { Client } from "../clients/Client";
import { MenfessUseCase } from "./MenfessUsecase";
import { SubscriptionUsecase } from "./SubscriptionUsecase";

export class Usecase {
    private userUsecase: UserUsecase;
    private postUsecase: PostUsecase;
    private menfessUsecase: MenfessUseCase;
    private subscriptionUsecase: SubscriptionUsecase;

    constructor(repo: PrismaClient, client: Client) {
        this.userUsecase = new UserUsecase(repo);
        this.postUsecase = new PostUsecase(repo);
        this.menfessUsecase = new MenfessUseCase(repo);
        this.subscriptionUsecase = new SubscriptionUsecase(repo);
    }

    get user() {
        return this.userUsecase;
    }

    get post() {
        return this.postUsecase;
    }

    get menfess() {
        return this.menfessUsecase;
    }

    get subscription() {
        return this.subscriptionUsecase;
    }
}
