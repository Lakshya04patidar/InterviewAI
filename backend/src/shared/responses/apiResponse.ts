import { Response } from "express";

interface ApiResponseOptions<T> {
    res: Response;
    statusCode?: number;
    message: string;
    data?: T;
}

export const sendSuccess = <T>({
    res,
    statusCode = 200,
    message,
    data,
}: ApiResponseOptions<T>) => {
    return res.status(statusCode).json({
        success: true,
        message,
        ...(data !== undefined && { data }),
    });
};