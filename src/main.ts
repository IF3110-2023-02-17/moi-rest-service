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

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
