import { PrismaClient } from "@prisma/client";
import { UploadedFile } from "express-fileupload";
import path from "path";
import { Exception } from "../utils/Exception";

export class MenfessUseCase {
    private repo: PrismaClient;

    constructor(repo: PrismaClient) {
        this.repo = repo;
    }

    public async getAll(studioID: number) {
        const result = await this.repo.fans_Message.findMany({
            where: {
                studio_id: studioID,
            },
        });
        return result;
    }

    public async insert({
        sender,
        body,
        studio_id,
    }: {
        sender: string;
        body: string;
        studio_id: number;
    }) {
        const row = await this.repo.fans_Message.create({
            data: {
                sender: sender,
                body: body,
                studio_id: studio_id,
            },
        });
        if (!row) {
            throw new Exception("No Row Affected", 500);
        }
        return row;
    }
}
