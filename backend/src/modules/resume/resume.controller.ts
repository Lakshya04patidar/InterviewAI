import { Request, Response, ParamsDictionary } from "express-serve-static-core";
import { AppError } from "../../shared/errors/AppError";
import { sendSuccess } from "../../shared/responses/apiResponse";
import { createResumeSchema } from "./resume.validation";
import { createResume, getUserResumes, getResumeById, deleteResume } from "./resume.service";

export const create = async(
    req: Request,
    res: Response
) => {
    if(!req.user){
        throw new AppError("Authentication required", 401);
    }

    const validatedData = createResumeSchema.parse(req.body);

    const resume = await createResume(
        req.user.id,
        validatedData
    );

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