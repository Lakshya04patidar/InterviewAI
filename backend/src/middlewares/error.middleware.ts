import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { AppError } from "../shared/errors/AppError";
import logger from "../shared/logger/logger";

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error("Actual Server Error: ", error);

    let statusCode = 500;
    let message = "Internal Server Error";

    if(error instanceof AppError){
        statusCode = error.statusCode;
        message = error.message;
    } else if(error instanceof multer.MulterError){
        if(error.code === "LIMIT_FILE_SIZE"){
            statusCode = 413;
            message = "Resume file must be smaller tham 5 MB";
        } else {
            statusCode = 400;
            message = error.message;
        }
    } else if(error.message === "Only PDF, DOC, and DOCX files are allowed"){
        statusCode = 400;
        message = error.message;
    }

    logger.error(
        `${req.method} ${req.originalUrl} - ${statusCode} - ${message}`
    );

    res.status(statusCode).json({
        success: false,
        message,
    });
};