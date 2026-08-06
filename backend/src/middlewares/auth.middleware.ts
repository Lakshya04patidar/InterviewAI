import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../shared/errors/AppError";
import { jwtConfig } from "../config/jwt";
import { UserRole } from "../shared/constants";

interface AccessTokenPayLoad {
    userId: string;
    role: UserRole;
}

export const authenticate = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const authorization = req.headers.authorization;

    if(!authorization?.startsWith("Bearer ")){
        throw new AppError("Authentication required", 401);
    }

    const token = authorization.split(" ")[1];

    if(!token){
        throw new AppError("Authentication required", 401);
    }

    try {
        const decoded = jwt.verify(
            token,
            jwtConfig.accessSecret
        ) as AccessTokenPayLoad;

        req.user = {
            id: decoded.userId,
            role: decoded.role,
        };

        next();
    } catch {
        throw new AppError("Invalid or expired access token", 401);
    }
};