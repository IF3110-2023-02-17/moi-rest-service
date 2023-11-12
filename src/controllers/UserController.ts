import { IController } from "../interfaces/IController";
import { Router, Request, Response } from "express";
import noMiddleware from "../middlewares/noMiddleware";
import { Usecase } from "../usecases/Usecase";
import { UserUsecase } from "../usecases/UserUsecase";
import { HttpStatus } from "../utils/HttpStatus";
import { HttpStatusCode } from "axios";
import { Exception } from "../utils/Exception";

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
        this.router.post("/register", noMiddleware, this.registerHandler);
        this.router.post("/logout", noMiddleware, this.logoutHandler);
    }

    public controllerRouter = (): Router => {
        return this.router;
    };

    /**
     * @HandlerFunction
     * */

    registerHandler = async (req: Request, res: Response) => {
        try {
            const { name, email, password, estDate, description } = req.body;

            if (!name || !email || !password || !estDate || !description) {
                throw new Exception("Field Invalid or Not Complete", HttpStatus.BAD_REQUEST);
            }

            await this.user.register(name, email, password, new Date(estDate), description);

            return res.status(HttpStatus.SUCCESS).json({});
        } catch (err) {
            const exp = err as Exception;
            console.log(exp.status);

            return res.status(exp.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ msg: exp.message });
        }
    };

    loginHandler = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                throw new Exception("Field Invalid or Not Complete", HttpStatus.BAD_REQUEST);
            }

            const token = await this.user.login(email, password);

            /**
             * @todo GANTI MAX AGE DI AKHIR
             */
            return res
                .status(HttpStatus.ACCEPTED)
                .cookie("TOKENMOI", token, {
                    path: "/",
                    httpOnly: true,
                    maxAge: 1000,
                })
                .json({
                    msg: "Success Login !",
                });
        } catch (err) {
            const exp = err as Exception;
            console.log(exp.status);

            return res.status(exp.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ msg: exp.message });
        }
    };

    logoutHandler = async (req: Request, res: Response) => {
        try {
            return res.status(HttpStatus.ACCEPTED).clearCookie("TOKENMOI").json({
                msg: "Logout berhasil",
            });
        } catch (err) {
            return res.status(HttpStatus.BAD_REQUEST).json({ msg: "Logout gagal" });
        }
    };
}
