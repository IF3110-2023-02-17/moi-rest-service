import { Request, Response, Router } from "express";
import { z } from "zod";
import { IController } from "../interfaces/IController";
import { authRequiredMiddleware } from "../middlewares/authMiddleware";
import { MovieUsecase } from "../usecases/MovieUsecase";
import { Usecase } from "../usecases/Usecase";

export class MovieController implements IController {
    private router: Router;
    private movie: MovieUsecase;
    private CreateSchema = z.object({
        title: z.string(),
        body: z.string(),
    });

    constructor(usecase: Usecase) {
        this.router = Router();
        this.movie = usecase.movie;
        this.initalizeRouter();
    }

    private initalizeRouter(): void {
        this.router.get(
            "/",
            authRequiredMiddleware,
            this.getAllHandler.bind(this)
        );

        this.router.get(
            "/available",
            authRequiredMiddleware,
            this.getAvailableHandler.bind(this)
        );

        this.router.post(
            "/:id",
            authRequiredMiddleware,
            this.addToStudio.bind(this)
        );
    }

    controllerRouter(): Router {
        return this.router;
    }

    private async getAllHandler(req: Request, res: Response) {
        const movies = await this.movie.getAllByStudio(req.auth.studio_id);
        return res.status(200).json({ movies });
    }

    private async getAvailableHandler(req: Request, res: Response) {
        const movies = await this.movie.getAvailable();
        return res.status(200).json({ movies });
    }

    private async addToStudio(req: Request<{ id: string }>, res: Response) {
        const movieNum = Number(req.params.id);
        if (isNaN(movieNum)) {
            return res.status(404).json({ error: "Not Found" });
        }
        const success = await this.movie.addToStudio(
            req.auth.studio_id,
            movieNum
        );

        return res.status(200).json({ success });
    }
}
