import { PrismaClient } from "@prisma/client";
import { UploadedFile } from "express-fileupload";
import path from "path";

export class SubscriptionUsecase {
    private repo: PrismaClient;

    constructor(repo: PrismaClient) {
        this.repo = repo;
    }

    public async getAll() {
        const result = await this.repo.subscription.findMany();
        return result;
    }

    public async create(studio_id: number, target_subscription_studio_id: number) {
        const isExists = await this.repo.subscription.findFirst({
            where: {
                studio_id,
                target_subscription_studio_id
            }
        });

        if(isExists) {
            return "error";
        }

        const result = await this.repo.subscription.create({
            data: {
                studio_id,
                target_subscription_studio_id: target_subscription_studio_id
            },
        });
        return result;
    }

    public async delete(studio_id: number, target_subscription_studio_id: number) {
        const subscribe = await this.repo.subscription.findFirst({
            where: {
                AND: { target_subscription_studio_id, studio_id }
            }
        });

        if(!subscribe) {
            return "error";
        }

        const result = await this.repo.subscription.delete({
            where: {
                subscription_id: subscribe.subscription_id,
            },
        });

        return result;
    }
}
