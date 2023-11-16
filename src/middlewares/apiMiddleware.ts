import { NextFunction, Request, Response } from "express";
import { Exception } from "../utils/Exception";
import { HttpStatus } from "../utils/HttpStatus";

const apiMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const key = req.headers["Api-Key"];

    if (key === process.env.REST_API_KEY) {
        throw new Exception("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    return next();
};
