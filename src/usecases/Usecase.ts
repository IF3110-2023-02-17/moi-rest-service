import { PrismaClient } from "@prisma/client";
import { Client } from "../clients/Client";
import { MenfessUseCase } from "./MenfessUsecase";
import { MovieUsecase } from "./MovieUsecase";
import { PostUsecase } from "./PostUsecase";
import { StudioUseCase } from "./StudioUsecase";
import { SubscriptionUsecase } from "./SubscriptionUsecase";
import { UserUsecase } from "./UserUsecase";

export class Usecase {
    private userUsecase: UserUsecase;
    private postUsecase: PostUsecase;
    private menfessUsecase: MenfessUseCase;
    private subscriptionUsecase: SubscriptionUsecase;
    private studioUsecase: StudioUseCase;
    private movieUsecase: MovieUsecase;

    constructor(repo: PrismaClient, client: Client) {
        this.userUsecase = new UserUsecase(repo);
        this.postUsecase = new PostUsecase(repo);
        this.menfessUsecase = new MenfessUseCase(repo);
        this.subscriptionUsecase = new SubscriptionUsecase(repo, client);
        this.studioUsecase = new StudioUseCase(repo, client);
        this.movieUsecase = new MovieUsecase(repo, client);
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

    get studio() {
        return this.studioUsecase;
    }

    get movie() {
        return this.movieUsecase;
    }
}
