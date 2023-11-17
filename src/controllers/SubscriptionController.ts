import { Post } from "@prisma/client";
import { Request, Response, Router } from "express";
import { z } from "zod";
import { IController } from "../interfaces/IController";
import { SubscriptionUsecase } from "../usecases/SubscriptionUsecase";
import { Usecase } from "../usecases/Usecase";
import { HttpStatus } from "../utils/HttpStatus";
import { authOptionalMiddleware } from "../middlewares/authMiddleware";

export class SubscriptionController implements IController {
    private router: Router;
    private subscription: SubscriptionUsecase;

    constructor(usecase: Usecase) {
        this.router = Router();
        this.subscription = usecase.subscription;
        this.initalizeRouter();
    }

    private initalizeRouter(): void {
        this.router.get(
            "/",
            authOptionalMiddleware,
            this.getAllHandler.bind(this)
        );
        this.router.post(
            "/accept/:subscriber_id",
            authOptionalMiddleware,
            this.acceptHandler.bind(this)
        );
        this.router.post(
            "/reject/:subscriber_id",
            authOptionalMiddleware,
            this.rejectHandler.bind(this)
        );
    }

    controllerRouter(): Router {
        return this.router;
    }

    // READ SUBSCRIPTION
    private async getAllHandler(req: Request, res: Response) {
        try {
            const subscriptions = await this.subscription.getAllByStudio(
                req.auth.studio_id
            );
            return res.status(200).json({ subscription: subscriptions });
        } catch (err: any) {
            return res.status(err.status).json({ err: err.message });
        }
    }

    // ACCEPT SUBSCRIPTION
    private async acceptHandler(req: Request, res: Response) {
        try {
            console.log("test");
            const subscriberID = Number(req.params.subscriber_id);
            const subscription = await this.subscription.accept(
                req.auth.studio_id,
                subscriberID
            );

            return res.status(200).json({
                subscription: subscription,
                message: "Accept Success!!",
            });
        } catch (err: any) {
            return res.status(err.status).json({
                subscription: null,
                message: err.message,
            });
        }
    }

    // REJECT SUBSCRIPTION
    private async rejectHandler(req: Request, res: Response) {
        try {
            console.log("test");
            const subscriberID = Number(req.params.subscriber_id);
            const subscription = await this.subscription.reject(
                req.auth.studio_id,
                subscriberID
            );

            return res.status(200).json({
                subscription: subscription,
                message: "Reject Success!!",
            });
        } catch (err: any) {
            return res.status(err.status).json({
                subscription: null,
                message: err.message,
            });
        }
    }
}
