import { Post } from "@prisma/client";
import { Request, Response, Router } from "express";
import { z } from "zod";
import { IController } from "../interfaces/IController";
import { SubscriptionUsecase } from "../usecases/SubscriptionUsecase";
import { Usecase } from "../usecases/Usecase";
import { HttpStatus } from "../utils/HttpStatus";

export class SubscriptionController implements IController {
    private router: Router;
    private subscription: SubscriptionUsecase;

    constructor(usecase: Usecase) {
        this.router = Router();
        this.subscription = usecase.subscription;
        this.initalizeRouter();
    }

    private initalizeRouter(): void {
        this.router.get("/", this.getAllHandler.bind(this));
        this.router.post("/", this.createHandler.bind(this));
        this.router.delete("/", this.deleteHandler.bind(this));
    }

    controllerRouter(): Router {
        return this.router;
    }

    // READ SUBSCRIPTION
    private async getAllHandler(req: Request, res: Response) {
        const subscriptions = await this.subscription.getAll();
        return res.status(200).json({ subscriptions });
    }

    // ACCEPT SUBSCRIPTION
    private async createHandler(
        req: Request<{
            studio_id: number;
            target_subscription_studio_id: number;
        }>,
        res: Response
    ) {
        const { studio_id, target_subscription_studio_id } = req.body;
        const subscription = await this.subscription.create(
            studio_id,
            target_subscription_studio_id
        );
        if (subscription === "error") {
            return res
                .status(400)
                .json({
                    message:
                        "Error cannot subscribe! Studio already subscribe!",
                });
        }
        return res
            .status(200)
            .json({ subscription, message: "Subscribe Success!!" });
    }

    // REJECT SUBSCRIPTION
    private async deleteHandler(
        req: Request<{
            studio_id: number;
            target_subscription_studio_id: number;
        }>,
        res: Response
    ) {
        const { studio_id, target_subscription_studio_id } = req.body;
        const subscription = await this.subscription.delete(
            studio_id,
            target_subscription_studio_id
        );
        if (subscription === "error") {
            return res
                .status(404)
                .json({ message: "Error cannot unsubscribe! Not found!" });
        }
        return res
            .status(200)
            .json({ subscription, message: "Unsubscribe Success!!" });
    }
}
