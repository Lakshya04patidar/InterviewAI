import { Request, Response } from "express";
import { AppError } from "../../shared/errors/AppError";
import { sendSuccess } from "../../shared/responses/apiResponse";
import { analyzeResume } from "./resumeAnalysis.service";

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