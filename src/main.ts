import express from "express";
import { Controller } from "./controllers/Controller";
import noMiddleware from "./middlewares/noMiddleware";
import { Usecase } from "./usecases/Usecase";
import db from "./clients/db/Database";

const port = 8000;
const app = express();

app.use(express.json());

const usecase = new Usecase(db);
const controller = new Controller(usecase);

app.use("/v1/api", noMiddleware, controller.controllerRouter());

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
