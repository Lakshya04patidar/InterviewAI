import { Request, Response } from "express";
import { AppError } from "../../shared/errors/AppError";
import { sendSuccess } from "../../shared/responses/apiResponse";
import { getResumeAnalysis, analyzeResume } from "./resumeAnalysis.service";
import { asyncHandler } from "../../shared/handlers/asyncHandler";

export const analyze = async (
    req: Request,
    res: Response
) => {
    if(!req.user){
        throw new AppError(
            "Authentication required", 401
        );
    }

    const resumeId = req.params.resumeId as string;

    const analysis = await analyzeResume(
        req.user.id,
        resumeId
    );

    return sendSuccess({
        res,
        statusCode: 200,
        message: "Resume analyze successfully",
        data: analysis,
    });
};

export const getAnalysis = async (
    req: Request,
    res: Response
) => {
    if (!req.user) {
        throw new AppError("Authentication required", 401);
    }

    const resumeId = req.params.resumeId as string;

    const analysis = await getResumeAnalysis(
        req.user.id,
        resumeId
    );

    return sendSuccess({
        res,
        statusCode: 200,
        message: "Resume analysis fetched successfully",
        data: analysis,
    });
};