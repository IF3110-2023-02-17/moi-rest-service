import { Post, PrismaClient } from "@prisma/client";
import { UploadedFile } from "express-fileupload";
import path from "path";

export class PostUsecase {
    private repo: PrismaClient;

    constructor(repo: PrismaClient) {
        this.repo = repo;
    }

    public async create({
        img,
        ...data
    }: {
        title: string;
        body: string;
        img: UploadedFile;
        studio_id: number;
    }) {
        const imageName = Date.now() + img.name;

        const imagePath = path.resolve(__dirname, "../uploads/", imageName);

        await img.mv(imagePath);
        const result = await this.repo.post.create({
            data: {
                ...data,
                img_path: "/media/" + imageName,
            },
        });
        return result;
    }

    public async getById(id: number) {
        const result = await this.repo.post.findUnique({
            where: {
                post_id: id,
            },
        });
        return result;
    }

    public async update(
        id: number,
        {
            img,
            title,
            body,
        }: {
            title: string;
            body: string;
            img?: UploadedFile;
        }
    ) {
        let img_path: string | undefined = undefined;
        if (img) {
            const imageName = Date.now() + img.name;

            const imagePath = path.resolve(__dirname, "../uploads/", imageName);

            await img.mv(imagePath);
            img_path = "/media/" + imageName;
        }
        const result = await this.repo.post.update({
            where: {
                post_id: id,
            },
            data: {
                title,
                body,
                img_path,
            },
        });
        return result;
    }

    public async checkExists({
        post_id,
        studio_id,
    }: {
        post_id: number;
        studio_id: number;
    }) {
        const result = await this.repo.post.findFirst({
            where: {
                post_id,
                studio_id,
            },
            select: {
                post_id: true,
            },
        });
        return Boolean(result);
    }

    public async delete(id: number) {
        const result = await this.repo.post.delete({
            where: {
                post_id: id,
            },
        });
        return result;
    }

    public async getAllByStudio(studio_id: number) {
        const result = await this.repo.post.findMany({
            select: {
                post_id: true,
                title: true,
                body: true,
                updated_at: true,
                img_path: true,
            },
            orderBy: { updated_at: "desc" },
            where: {
                studio_id: studio_id,
            },
        });
        return result;
    }

    public async getAllByStudioWithOffset(studio_id: number, page: number) {
        const result = await this.repo.post.findMany({
            select: {
                post_id: true,
                title: true,
                body: true,
                updated_at: true,
                img_path: true,
            },
            orderBy: { updated_at: "desc" },
            where: {
                studio_id: studio_id,
            },
            skip: (page - 1) * 9,
            take: 9,
        });
        return result;
    }

    public async getCountPosts(studio_id: number) {
        const total: number = await this.repo.post.count({
            where: {
                studio_id: studio_id,
            },
        });

        return Math.ceil(total / 9);
    }
}
