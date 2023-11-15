import { PrismaClient } from "@prisma/client";
import { UploadedFile } from "express-fileupload";
import path from "path";

export class MenfessUseCase {
    private repo: PrismaClient;

    constructor(repo: PrismaClient) {
        this.repo = repo;
    }

    public async getAll() {
        const result = await this.repo.fans_Message.findMany();
        return result;
    }
}
