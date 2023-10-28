import { PrismaClient, Test } from "@prisma/client";

export class UserUsecase {
    private repo: PrismaClient;

    constructor(repo: PrismaClient) {
        this.repo = repo;
    }

    public async login(username: string, password: string): Promise<Test[]> {
        const tests: Test[] = await this.repo.test.findMany();
        return tests;
    }
}
