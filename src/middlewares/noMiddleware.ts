import { NextFunction, Request, Response } from "express";

const noMiddleware = (req: Request, res: Response, next: NextFunction) => {
    next();
};

export default noMiddleware;
