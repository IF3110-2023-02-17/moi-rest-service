import { Router } from "express";
import { IController } from "../interfaces/IController";
import noMiddleware from "../middlewares/noMiddleware";
import { Usecase } from "../usecases/Usecase";
import { MenfessController } from "./MenfessController";
import { MovieController } from "./MovieController";
import { PostController } from "./PostController";
import { StudioController } from "./StudioController";
import { SubscriptionController } from "./SubscriptionController";
import { UserController } from "./UserController";

export class Controller implements IController {
    private router: Router;
    private userController: UserController;
    private postController: PostController;
    private menfessController: MenfessController;
    private subscriptionController: SubscriptionController;
    private studioController: StudioController;
    private movieController: MovieController;

    constructor(usecase: Usecase) {
        this.router = Router();
        this.userController = new UserController(usecase);
        this.postController = new PostController(usecase);
        this.menfessController = new MenfessController(usecase);
        this.subscriptionController = new SubscriptionController(usecase);
        this.studioController = new StudioController(usecase);
        this.movieController = new MovieController(usecase);
        this.initalizeRouter();
    }

    private initalizeRouter(): void {
        this.router.use(
            "/user",
            noMiddleware,
            this.userController.controllerRouter()
        );
        this.router.use(
            "/posts",

            this.postController.controllerRouter()
        );
        this.router.use(
            "/menfess",
            noMiddleware,
            this.menfessController.controllerRouter()
        );
        this.router.use(
            "/subscription",
            noMiddleware,
            this.subscriptionController.controllerRouter()
        );
        this.router.use(
            "/studio",
            noMiddleware,
            this.studioController.controllerRouter()
        );
        this.router.use("/movies", this.movieController.controllerRouter());
    }

    public controllerRouter = (): Router => {
        return this.router;
    };
}
