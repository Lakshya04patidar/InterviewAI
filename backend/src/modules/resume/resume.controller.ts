import { Request, Response } from "express-serve-static-core";
import { AppError } from "../../shared/errors/AppError";
import { sendSuccess } from "../../shared/responses/apiResponse";
import { createResume, getUserResumes, getResumeById, deleteResume } from "./resume.service";

export const create = async(req: Request, res: Response) => {
    if(!req.user){
        throw new AppError("Authentication required", 401);
    }

    if(!req.file){
        throw new AppError("Resume file is required", 400);
    }

    const file = req.file;

    const resume = await createResume(req.user.id, {
        fileName: file.originalname,
        fileUrl: `/uploads/resumes/${file.filename}`,
        fileType: file.mimetype,
        fileSize: file.size,
        filePath: file.path,
    });

    return sendSuccess({
        res,
        statusCode: 201,
        message: "Resume created successfully",
        data: resume,
    });
};

export const getAll = async(
    req: Request,
    res: Response
) => {
    if(!req.user){
        throw new AppError("Authentication required", 401);
    }

    const resumes = await getUserResumes(req.user.id);

    return sendSuccess({
        res,
        message: "Resumes fetched successfully",
        data: resumes,
    });
};

export const getById = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    if(!req.user){
        throw new AppError("Authenticcation required", 401);
    }

    const resumeId = req.params.id as string;

    const resume = await getResumeById(
        req.user.id,
        resumeId
    );

    return sendSuccess({
        res,
        message: "Resume fetched successfully",
        data: resume,
    });
};

export const remove = async (
    req: Request,
    res: Response
) => {
    if(!req.user){
        throw new AppError("Authentication required", 401);
    }

    const resumeId = req.params.id as string;

    await deleteResume(
        req.user.id,
        resumeId
    );

    return sendSuccess({
        res,
        message: "Resume deleted successfully",
    });
};