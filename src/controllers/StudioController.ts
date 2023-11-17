import { Post } from "@prisma/client";
import { Request, Response, Router } from "express";
import { z } from "zod";
import { IController } from "../interfaces/IController";
import { StudioUseCase } from "../usecases/StudioUsecase";
import { Usecase } from "../usecases/Usecase";
import { HttpStatus } from "../utils/HttpStatus";
import noMiddleware from "../middlewares/noMiddleware";

export class StudioController implements IController {
    private router: Router;
    private studio: StudioUseCase;

    constructor(usecase: Usecase) {
        this.router = Router();
        this.studio = usecase.studio;
        this.initalizeRouter();
    }

    private initalizeRouter(): void {
        this.router.get(
            "/:subscriber_id/:page",
            noMiddleware,
            this.getStudioHandler
        );
        this.router.get("/", this.getAllHandler.bind(this));
        this.router.get("/:studio_id", this.getName.bind(this));
    }

    controllerRouter(): Router {
        return this.router;
    }

    getStudioHandler = async (
        req: Request<{ subscriber_id: string; page: string }>,
        res: Response
    ) => {
        const subscriberID: number = Number(req.params.subscriber_id);
        const page: number = Number(req.params.page);

        const count: boolean = Boolean(req.query.count);

        if (isNaN(subscriberID)) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json({ error: "Invalid Argument" });
        }

        const result = await this.studio.getStudioBySubscriber(
            subscriberID,
            page
        );

        let total: number;
        if (count) {
            total = await this.studio.getCountStudios();

            return res
                .status(HttpStatus.SUCCESS)
                .json({ studios: result, page: page, count: total });
        } else {
            return res
                .status(HttpStatus.SUCCESS)
                .json({ studios: result, page: page });
        }
    };

    // READ ALL STUDIOS
    private async getAllHandler(req: Request, res: Response) {
        const studios = await this.studio.getAll();
        return res.status(200).json({ studios });
    }

    private async getName(req: Request<{ studio_id: string }>, res: Response) {
        const studioID = Number(req.params.studio_id);
        console.log("test");

        const name = await this.studio.getStudioName(studioID);

        return res.status(200).json({ name });
    }
}
