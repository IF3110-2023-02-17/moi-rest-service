import { PrismaClient, Role } from "@prisma/client";
import { Client } from "../clients/Client";

export class StudioUseCase {
    private repo: PrismaClient;
    private client: Client;

    constructor(repo: PrismaClient, client: Client) {
        this.repo = repo;
        this.client = client;
    }

    public async getAll() {
        const result = await this.repo.studio.findMany();
        return result;
    }

    public async getStudioBySubscriber(subscriberID: number, page: number = 1) {
        const studios: any[] = await this.repo.studio.findMany({
            select: {
                studio_id: true,
                name: true,
                description: true,
            },
            where: {
                role: "STUDIO",
            },
            skip: (page - 1) * 9,
            take: 9,
        });

        const subscribe = await this.client.soap.invoke(
            { subscriberID: subscriberID },
            "getSubscriptionSubscriber"
        );

        const subsmap = new Map<number, string>();
        if (subscribe != null) {
            for (let i = 0; i < subscribe.result.length; i++) {
                subsmap.set(
                    subscribe.result.at(i).studioId as number,
                    subscribe.result.at(i).status as string
                );
            }
        }
        for (let i = 0; i < studios.length; i++) {
            studios.at(i).accept = false;
            studios.at(i).pending = false;
            studios.at(i).reject = false;
            if (subsmap.get(studios.at(i).studio_id) == "ACCEPTED") {
                studios.at(i).accept = true;
            } else if (subsmap.get(studios.at(i).studio_id) == "PENDING") {
                studios.at(i).pending = true;
            } else if (subsmap.get(studios.at(i).studio_id) == "REJECTED") {
                studios.at(i).reject = true;
            }
        }

        return studios;
    }

    public async getCountStudios() {
        const total: number = await this.repo.studio.count({
            where: {
                role: "STUDIO",
            },
        });

        return Math.ceil(total / 9);
    }

    public async getStudioNameByID(studio_id: number) {
        const studio = await this.repo.studio.findFirst({
            where: {
                studio_id: studio_id,
            },
            select: {
                name: true,
            },
        });

        return studio?.name;
    }
}
