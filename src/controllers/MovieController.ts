import { Post } from "@prisma/client";
import { Request, Response, Router } from "express";
import { z } from "zod";
import { IController } from "../interfaces/IController";
import { PostUsecase } from "../usecases/PostUsecase";
import { StudioUseCase } from "../usecases/StudioUsecase";
import { Usecase } from "../usecases/Usecase";
import { HttpStatus } from "../utils/HttpStatus";
import { authRequiredMiddleware } from "../middlewares/authMiddleware";

export class MovieController implements IController {
    private router: Router;
    private post: PostUsecase;
    private CreateSchema = z.object({
        title: z.string(),
        body: z.string(),
    });

    constructor(usecase: Usecase) {
        this.router = Router();
        this.post = usecase.post;
        this.studio = usecase.studio;
        this.initalizeRouter();
    }

    private initalizeRouter(): void {
        this.router.get(
            "/:studio_id/:page",
            this.getAllByStudioHandler.bind(this)
        );
    }

    controllerRouter(): Router {
        return this.router;
    }

    private async getHandler(req: Request<{ post_id: string }>, res: Response) {
        const postNum = Number(req.params.post_id);
        if (isNaN(postNum)) {
            return res.status(404).json({ error: "Not Found" });
        }

        const post = await this.post.getById(postNum);
        if (!post) {
            return res.status(404).json({ error: "Not Found" });
        }

        return res.status(200).json({ post });
    }
}
