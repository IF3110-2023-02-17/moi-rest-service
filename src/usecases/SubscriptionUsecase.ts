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

    public async getAllRequestByStudio(studioID: number) {
        try {
            const { result } = await this.client.soap.invoke(
                { studioID: studioID, status: "PENDING" },
                "getSubscriptionByStatusStudio"
            );

            const subsname = await this.client.mono.get(
                `/subscription/name/${studioID}/PENDING`
            );
            const subsnamemap = new Map<number, string>();
            if (subsname != null) {
                for (let i = 0; i < subsname.data.length; i++) {
                    subsnamemap.set(
                        Number(subsname.data.at(i).subscriber_id),
                        subsname.data.at(i).username as string
                    );
                }
            }
            // console.log(subsnamemap);
            // console.log(result.at(1).subsId);
            // console.log(subsnamemap.get(result.at(1).subsId));

            // console.log(result);
            for (let i = 0; i < result.length; i++) {
                result.at(i).subsName = "Unknown";
                if (subsnamemap.get(result.at(i).subsId)) {
                    result.at(i).subsName = subsnamemap.get(
                        result.at(i).subsId
                    );
                }
            }

            return result;
        } catch (err) {
            return null;
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
