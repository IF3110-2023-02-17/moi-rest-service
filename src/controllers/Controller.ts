import { Router } from "express";
import { IController } from "../interfaces/IController";
import { authRequiredMiddleware } from "../middlewares/authMiddleware";
import noMiddleware from "../middlewares/noMiddleware";
import { Usecase } from "../usecases/Usecase";
import { MenfessController } from "./MenfessController";
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

    constructor(usecase: Usecase) {
        this.router = Router();
        this.userController = new UserController(usecase);
        this.postController = new PostController(usecase);
        this.menfessController = new MenfessController(usecase);
        this.subscriptionController = new SubscriptionController(usecase);
        this.studioController = new StudioController(usecase);
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
            authRequiredMiddleware,
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
    }

    public controllerRouter = (): Router => {
        return this.router;
    };
}
