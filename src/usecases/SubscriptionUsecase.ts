import { PrismaClient } from "@prisma/client";
import { UploadedFile } from "express-fileupload";
import path from "path";
import { Client } from "../clients/Client";

export class SubscriptionUsecase {
    private repo: PrismaClient;
    private client: Client;

    constructor(repo: PrismaClient, client: Client) {
        this.repo = repo;
        this.client = client;
    }

    public async getAllByStudio(studioID: number) {
        try {
            const result = await this.client.soap.invoke(
                { studioID: studioID },
                "getSubscriptionStudio"
            );

            return result.result;
        } catch (err) {
            throw err;
        }
    }

    public async accept(studioID: number, subscriberID: number) {
        try {
            const result = await this.client.soap.invoke(
                { studioID: studioID, subscriberID: subscriberID },
                "acceptSubscription"
            );

            return result.result;
        } catch (err) {
            throw err;
        }
    }

    public async reject(studioID: number, subscriberID: number) {
        try {
            const result = await this.client.soap.invoke(
                { studioID: studioID, subscriberID: subscriberID },
                "rejectSubscription"
            );

            return result.result;
        } catch (err) {
            throw err;
        }
    }
}
