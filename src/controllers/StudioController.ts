import { Post } from "@prisma/client";
import { Request, Response, Router } from "express";
import { z } from "zod";
import { IController } from "../interfaces/IController";
import { StudioUseCase } from "../usecases/StudioUsecase";
import { Usecase } from "../usecases/Usecase";

export class StudioController implements IController {
    private router: Router;
    private studio: StudioUseCase;

    constructor(usecase: Usecase) {
        this.router = Router();
        this.studio = usecase.studio;
        this.initalizeRouter();
    }

    private initalizeRouter(): void {
        this.router.get("/", this.getAllHandler.bind(this));
    }

    controllerRouter(): Router {
        return this.router;
    }

    // READ ALL STUDIOS
    private async getAllHandler(req: Request, res: Response)  {
        const studios = await this.studio.getAll();
        return res.status(200).json({ studios });
    }
}
