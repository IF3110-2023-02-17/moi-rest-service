import { Post } from "@prisma/client";
import { Request, Response, Router } from "express";
import { z } from "zod";
import { IController } from "../interfaces/IController";
import { PostUsecase } from "../usecases/PostUsecase";
import { Usecase } from "../usecases/Usecase";

export class PostController implements IController {
    private router: Router;
    private post: PostUsecase;
    private CreateSchema = z.object({
        title: z.string(),
        body: z.string(),
    });

    constructor(usecase: Usecase) {
        this.router = Router();
        this.post = usecase.post;
        this.initalizeRouter();
    }

    private initalizeRouter(): void {
        this.router.get("/", this.getAllHandler.bind(this));
        this.router.get("/:post_id", this.getHandler.bind(this));
        this.router.post("/", this.createHandler.bind(this));
        this.router.put("/:post_id", this.putHandler.bind(this));
        this.router.delete("/:post_id", this.deleteHandler.bind(this));
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

    private async getAllHandler(req: Request, res: Response) {
        const posts = await this.post.getAllByStudio(req.auth.studio_id);
        return res.status(200).json({ posts });
    }

    private async createHandler(req: Request, res: Response) {
        if (!req.files || !req.files.image) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const image = Array.isArray(req.files.image)
            ? req.files.image[0]
            : req.files.image;

        if (!image.mimetype.startsWith("image/")) {
            return res.status(400).json({ error: "File is not an image" });
        }

        const studioId = req.auth.studio_id;

        const result = this.CreateSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error.message });
        }
        const newPost = await this.post.create({
            ...result.data,
            studio_id: studioId,
            img: image,
        });

        return res.status(201).json({ post: newPost });
    }

    private async putHandler(
        req: Request<{
            post_id: string;
        }>,
        res: Response
    ) {
        const studioId = req.auth.studio_id;

        const postNum = Number(req.params.post_id);
        if (
            isNaN(postNum) ||
            !(await this.post.checkExists({
                post_id: postNum,
                studio_id: studioId,
            }))
        ) {
            return res.status(404).json({ error: "Not Found" });
        }

        const result = this.CreateSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ error: result.error.message });
        }

        let updatedPost: Post;

        if (req.files && req.files.image) {
            const image = Array.isArray(req.files.image)
                ? req.files.image[0]
                : req.files.image;

            if (!image.mimetype.startsWith("image/")) {
                return res.status(400).json({ error: "File is not an image" });
            }
            updatedPost = await this.post.update(postNum, {
                ...result.data,
                img: image,
            });
        } else {
            updatedPost = await this.post.update(postNum, {
                body: result.data.body,
                title: result.data.title,
            });
        }

        return res.status(200).json({ post: updatedPost });
    }

    private async deleteHandler(
        req: Request<{
            post_id: string;
        }>,
        res: Response
    ) {
        const studioId = req.auth.studio_id;

        const postNum = Number(req.params.post_id);
        if (
            isNaN(postNum) ||
            !(await this.post.checkExists({
                post_id: postNum,
                studio_id: studioId,
            }))
        ) {
            return res.status(404).json({ error: "Not Found" });
        }

        await this.post.delete(postNum);

        return res.status(200).json({ success: true });
    }
}
