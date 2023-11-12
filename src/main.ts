import express, { Request, Response } from "express";
import { Controller } from "./controllers/Controller";
import noMiddleware from "./middlewares/noMiddleware";
import { Usecase } from "./usecases/Usecase";
import { Client } from "./clients/Client";
import * as dotenv from "dotenv";
import { Database } from "./database/Database";

const port = 8003;
const app = express();

dotenv.config();

app.use(express.json());

const client = new Client();
const db = new Database();
const usecase = new Usecase(db.database, client);
const controller = new Controller(usecase);

app.use("/v1/api", noMiddleware, controller.controllerRouter());

// app.get("/test1", async (req: Request, res: Response) => {
//     const data = await client.mono.testMonoClient("/test", "string");

//     return res.json({ test: data });
// });
// app.get("/test", async (req: Request, res: Response) => {
//     try {
//         if (!client.soap) {
//             console.log("Terminate");
//         }
//         console.log("Pass");
//         const result = await client.soap.rawMethod({}, "getSubscriptions");

//         console.log(result);
//         return res.status(200).json(result);
//     } catch (err: any) {
//         const status = await client.soap.getStatusCode(err.rawResponse);
//         console.log(status["S:Envelope"]["S:Body"][0]["S:Fault"][0]["detail"][0]["ns2:Exception"][0]["message"][0]);
//         return res.json({ test: "keluar" });
//     }
// });

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
