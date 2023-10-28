import { PrismaClient } from "@prisma/client";
import { Response, Request, NextFunction, Router } from "express";

export interface IController {
    /** method **/
    controllerRouter(): Router;
}
