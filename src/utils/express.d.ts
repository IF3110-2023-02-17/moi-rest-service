import { Role } from "@prisma/client";

// to make the file a module and avoid the TypeScript error
export {};

declare global {
    namespace Express {
        export interface Request {
            auth: {
                studio_id: number;
                name: string;
                role: Role;
            };
        }
    }
}
