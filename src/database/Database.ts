import { PrismaClient } from "@prisma/client";

export class Database {
    readonly database: PrismaClient;

    constructor() {
        this.database = new PrismaClient();
    }
}
