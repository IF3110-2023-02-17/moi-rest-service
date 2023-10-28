import { Router } from "express";
import { IController } from "../interfaces/IController";
import { UserController } from "./UserController";
import noMiddleware from "../middlewares/noMiddleware";
import { Usecase } from "../usecases/Usecase";

export class Controller implements IController {
    private router: Router;
    private userController: UserController;

    constructor(usecase: Usecase) {
        this.router = Router();
        this.userController = new UserController(usecase);
        this.initalizeRouter();
    }

    private initalizeRouter(): void {
        this.router.use("/user", noMiddleware, this.userController.controllerRouter());
    }

    public controllerRouter = (): Router => {
        return this.router;
    };
}
