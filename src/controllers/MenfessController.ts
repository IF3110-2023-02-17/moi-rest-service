import { Post } from "@prisma/client";
import { Request, Response, Router } from "express";
import { z } from "zod";
import { IController } from "../interfaces/IController";
import { MenfessUseCase } from "../usecases/MenfessUsecase";
import { Usecase } from "../usecases/Usecase";

export class MenfessController implements IController {
    private router: Router;
    private menfess: MenfessUseCase;

    constructor(usecase: Usecase) {
        this.router = Router();
        this.menfess = usecase.menfess;
        this.initalizeRouter();
    }

    private initalizeRouter(): void {
        this.router.get("/", this.getAllHandler.bind(this));
    }

    controllerRouter(): Router {
        return this.router;
    }

    // READ INSERT MENFESS
    private async getAllHandler(req: Request, res: Response)  {
        const menfesses = await this.menfess.getAll();
        return res.status(200).json({ menfesses });
    }
}
