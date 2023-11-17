import { Post } from "@prisma/client";
import { Request, Response, Router } from "express";
import { z } from "zod";
import { IController } from "../interfaces/IController";
import { MenfessUseCase } from "../usecases/MenfessUsecase";
import { Usecase } from "../usecases/Usecase";
import {
    authOptionalMiddleware,
    authRequiredMiddleware,
} from "../middlewares/authMiddleware";

export class MenfessController implements IController {
    private router: Router;
    private menfess: MenfessUseCase;
    private CreateSchema = z.object({
        sender: z.string(),
        body: z.string(),
        studio_id: z.number(),
    });

    constructor(usecase: Usecase) {
        this.router = Router();
        this.menfess = usecase.menfess;
        this.initalizeRouter();
    }

    private initalizeRouter(): void {
        this.router.get(
            "/",
            authRequiredMiddleware,
            this.getAllHandler.bind(this)
        );
        this.router.post("/", this.insertMenfessHandler.bind(this));
    }

    controllerRouter(): Router {
        return this.router;
    }

    // READ INSERT MENFESS
    private async getAllHandler(req: Request, res: Response) {
        const menfesses = await this.menfess.getAll(req.auth.studio_id);
        return res.status(200).json({ menfesses });
    }

    private async insertMenfessHandler(req: Request, res: Response) {
        const input = this.CreateSchema.safeParse(req.body);

        if (!input.success) {
            return res.status(400).json({ error: input.error.message });
        }

        const result = await this.menfess.insert(input.data);

        return res.status(200).json({
            menfesses: result,
            message: "Menfess Success!!",
        });
    }
}
