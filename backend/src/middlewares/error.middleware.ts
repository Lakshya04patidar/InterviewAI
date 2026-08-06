import { NextFunction, Request, Response } from "express";
import { AppError } from "../shared/errors/AppError";
import logger from "../shared/logger/logger";

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = error instanceof AppError ? error.statusCode : 500;

    const message = error instanceof AppError ? error.message : "Internal Server Error";

    logger.error(`${req.method} ${req.originalUrl} - ${statusCode} - ${message}`);

    res.status(statusCode).json({
        success: false,
        message,
    });
}