import axios, { AxiosInstance } from "axios";

export class MonoClient {
    private apiUrl: string;
    private client: AxiosInstance;

    constructor() {
        this.apiUrl = process.env.MONO_SERVICE_URL as string;
        this.client = axios.create({
            baseURL: this.apiUrl,
            timeout: 2000,
        });
    }

    public async get(endpoint: string) {
        const result = await this.client.get(endpoint);

        return result;
    }

    public async testMonoClient(
        endpoint: string,
        param: string
    ): Promise<{ status: number; data: any }> {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const result = await this.client.get("/test", config);

        // console.log(result);
        return { status: result.status, data: result.data };
    }

    public async getMoviesInIds(ids: number[]) {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const result = await this.client.get(
            "/movie/ids?ids=" + ids.join(","),
            config
        );

        return { status: result.status, data: result.data };
    }

    public async getMoviesNotInIds(ids: number[]) {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const result = await this.client.get(
            "/movie/notIds?ids=" + ids.join(","),
            config
        );

        return { status: result.status, data: result.data };
    }
}
