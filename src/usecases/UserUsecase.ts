import { PrismaClient } from "@prisma/client";

export class UserUsecase {
    private repo: PrismaClient;

    constructor(repo: PrismaClient) {
        this.repo = repo;
    }

    public async login(username: string, password: string): Promise<null> {
        return null;
    }
}
