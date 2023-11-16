import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Exception } from "../utils/Exception";

const authOptionalMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies["TOKENMOI"];
    if (!token) {
        return next();
    }
    try {
        const payload = jwt.verify(token, process.env.SECRET as string, {
            algorithms: ["HS256"],
        });
        req.auth = payload as (typeof req)["auth"];
        return next();
    } catch (err) {
        return next();
    }
};

const authRequiredMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    authOptionalMiddleware(req, res, () => {
        if (!req.auth) {
            throw new Exception("Unauthorized", 401);
        }
        return next();
    });
};

export { authOptionalMiddleware, authRequiredMiddleware };
