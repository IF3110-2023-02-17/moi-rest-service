import { Post } from "@prisma/client";
import { Request, Response, Router } from "express";
import { z } from "zod";
import { IController } from "../interfaces/IController";
import { PostUsecase } from "../usecases/PostUsecase";
import { StudioUseCase } from "../usecases/StudioUsecase";
import { Usecase } from "../usecases/Usecase";
import { HttpStatus } from "../utils/HttpStatus";
import { authRequiredMiddleware } from "../middlewares/authMiddleware";

export class PostController implements IController {
    private router: Router;
    private post: PostUsecase;
    private studio: StudioUseCase;
    private CreateSchema = z.object({
        title: z.string(),
        body: z.string(),
    });

    constructor(usecase: Usecase) {
        this.router = Router();
        this.post = usecase.post;
        this.studio = usecase.studio;
        this.initalizeRouter();
    }

    private initalizeRouter(): void {
        this.router.get(
            "/:studio_id/:page",
            this.getAllByStudioHandler.bind(this)
        );
        this.router.get(
            "/",
            authRequiredMiddleware,
            this.getAllHandler.bind(this)
        );
        this.router.get("/:post_id", this.getHandler.bind(this));
        this.router.post(
            "/",
            authRequiredMiddleware,
            this.createHandler.bind(this)
        );
        this.router.put(
            "/:post_id",
            authRequiredMiddleware,
            this.putHandler.bind(this)
        );
        this.router.delete(
            "/:post_id",
            authRequiredMiddleware,
            this.deleteHandler.bind(this)
        );
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

    private async getAllByStudioHandler(
        req: Request<{ studio_id: string; page: string }>,
        res: Response
    ) {
        const studioID: number = Number(req.params.studio_id);
        const page: number = Number(req.params.page);
        const count: boolean = Boolean(req.query.count);

        if (isNaN(studioID) || isNaN(page)) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json({ error: "Invalid Argument" });
        }
        console.log(page);

        const posts = await this.post.getAllByStudioWithOffset(studioID, page);

        let total: number;
        if (count) {
            const name = await this.studio.getStudioNameByID(studioID);

            total = await this.post.getCountPosts(studioID);
            return res
                .status(HttpStatus.SUCCESS)
                .json({ posts: posts, page: page, name: name, count: total });
        }
        return res
            .status(HttpStatus.SUCCESS)
            .json({ posts: posts, page: page });
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
