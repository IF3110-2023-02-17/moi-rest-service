import { IController } from "../interfaces/IController";
import { Router, Request, Response } from "express";
import noMiddleware from "../middlewares/noMiddleware";
import { Usecase } from "../usecases/Usecase";
import { UserUsecase } from "../usecases/UserUsecase";

export class UserController implements IController {
    private router: Router;
    private user: UserUsecase;

    constructor(usecase: Usecase) {
        this.router = Router();
        this.user = usecase.user;
        this.initalizeRouter();
    }

    private initalizeRouter(): void {
        this.router.post("/login", noMiddleware, this.loginHandler);
        this.router.post("/register", noMiddleware, this.loginHandler);
        this.router.post("/logout", noMiddleware, this.loginHandler);
    }

    public controllerRouter = (): Router => {
        return this.router;
    };
    // Handler
    loginHandler = async (req: Request, res: Response) => {
        try {
            const { username, password } = req.body;

            const result = await this.user.login(username, password);

            return res.json({ test1: result }).status(200);
        } catch (err) {
            return res.status(400);
        }
    };

    registerHandler = async (req: Request, res: Response) => {
        try {
            const { username, password, email } = req.body;

            return res.json({});
        } catch (err) {}
    };
}
