import { PrismaClient } from "@prisma/client";
import { Client } from "../clients/Client";

export class MovieUsecase {
    private repo: PrismaClient;
    private client: Client;

    constructor(repo: PrismaClient, client: Client) {
        this.repo = repo;
        this.client = client;
    }

    public async getAllByStudio(studio_id: number): Promise<Movie[]> {
        const moviesIds = await this.repo.studio_Movie
            .findMany({
                where: {
                    studio_id,
                },
            })
            .then((data) => data.map((d) => d.movie_id));
        if (moviesIds.length === 0) {
            return [];
        }
        const { data, status } = await this.client.mono.getMoviesInIds(
            moviesIds
        );
        if (status !== 200) {
            throw new Error("Failed to get movies");
        }
        if (!Array.isArray(data?.movies)) {
            return [];
        }
        data.movies.forEach((movie: Movie) => {
            movie.img_path =
                process.env.MONO_SERVICE_URL +
                "/media/img/movie/" +
                movie.img_path;
        });
        return data.movies;
    }

    public async getAvailable(): Promise<Movie[]> {
        const ids = await this.repo.studio_Movie
            .findMany({ select: { movie_id: true } })
            .then((data) => data.map((d) => d.movie_id));

        const { data, status } = await this.client.mono.getMoviesNotInIds(ids);

        if (status !== 200) {
            throw new Error("Failed to get movies");
        }

        if (!Array.isArray(data?.movies)) {
            return [];
        }
        data.movies.forEach((movie: Movie) => {
            movie.img_path =
                process.env.MONO_SERVICE_URL +
                "/media/img/movie/" +
                movie.img_path;
        });
        return data.movies;
    }

    public async addToStudio(studio_id: number, movie_id: number) {
        try {
            await this.repo.studio_Movie.create({
                data: {
                    studio_id,
                    movie_id,
                },
            });
            return true;
        } catch {
            return false;
        }
    }
}
