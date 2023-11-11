import { Router } from "express";
import { IController } from "../interfaces/IController";
import noMiddleware from "../middlewares/noMiddleware";
import { Usecase } from "../usecases/Usecase";
import { PostController } from "./PostController";
import { UserController } from "./UserController";

export class Controller implements IController {
    private router: Router;
    private userController: UserController;
    private postController: PostController;

    constructor(usecase: Usecase) {
        this.router = Router();
        this.userController = new UserController(usecase);
        this.postController = new PostController(usecase);
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
            noMiddleware,
            this.postController.controllerRouter()
        );
    }

    public controllerRouter = (): Router => {
        return this.router;
    };
}
