import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { Exception } from "../utils/Exception";
import { HttpStatus } from "../utils/HttpStatus";
export class UserUsecase {
    private repo: PrismaClient;

    constructor(repo: PrismaClient) {
        this.repo = repo;
    }

    public async register(
        name: string,
        email: string,
        password: string,
        estDate: Date,
        description: string
    ) {
        try {
            const countStudio: number = await this.repo.studio.count({
                where: {
                    email: email,
                },
            });

            if (countStudio) {
                throw new Exception(
                    "Email Already Used",
                    HttpStatus.BAD_REQUEST
                );
            }

            const salt = await bcryptjs.genSalt(10);
            const passwordHashed = await bcryptjs.hash(password, salt);

            const studio = await this.repo.studio.create({
                data: {
                    name: name,
                    email: email,
                    password_h: passwordHashed,
                    est_date: estDate,
                    description: description,
                },
            });

            console.log(studio);
        } catch (err) {
            const exp = err as Exception;

            if (exp.status < 500) {
                throw exp;
            } else {
                throw new Exception(
                    "Internal Server Error",
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }

    public async login(email: string, password: string) {
        try {
            const user = await this.repo.studio.findFirst({
                where: {
                    email: email,
                },
            });

            if (!user) {
                throw new Exception(
                    "Studio Does Not Exist",
                    HttpStatus.UNAUTHORIZED
                );
            }

            const valid = await bcryptjs.compare(password, user.password_h);

            if (!valid) {
                throw new Exception(
                    "Invalid Password",
                    HttpStatus.UNAUTHORIZED
                );
            }
            const payload = {
                studio_id: user.studio_id,
                name: user.name,
                role: user.role,
            };

            // 1 day
            const token = jwt.sign(payload, process.env.SECRET as string, {
                expiresIn: "1d",
                algorithm: "HS256",
            });

            return token;
        } catch (err) {
            const exp = err as Exception;

            if (exp.status < 500) {
                throw exp;
            } else {
                throw new Exception(
                    "Internal Server Error",
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }
}
