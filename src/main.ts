import express, { Request, Response } from "express";
import fileUpload from "express-fileupload";
import path from "path";
import { Controller } from "./controllers/Controller";
import { Usecase } from "./usecases/Usecase";
import { Client } from "./clients/Client";
import * as dotenv from "dotenv";
import { Database } from "./database/Database";

const port = 8003;
const app = express();

dotenv.config();

app.use(express.json());
app.use(fileUpload({}));
app.use("/media", express.static(path.join(__dirname, "uploads")));
const client = new Client();
const db = new Database();
const usecase = new Usecase(db.database, client);
const controller = new Controller(usecase);

app.use("/v1/api", controller.controllerRouter());

app.get("/test-soap", async (req: Request, res: Response) => {
    try {
        const response = await client.soap.rawMethod(
            { studioID: 1, status: "ACCEPTED" },
            "getSubscriptionByStatusStudio"
        );

        console.log(response);
        return res.status(200).json(response);
    } catch (err: any) {
        return res.status(err.status).json({ message: err.message });
    }
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
