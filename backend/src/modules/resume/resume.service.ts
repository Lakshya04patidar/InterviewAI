import { Resume } from "./resume.model";
import { CreateResumeInput } from "./resume.validation";
import { AppError } from "../../shared/errors/AppError";
import { Types } from "mongoose";

export const createResume = async (
  userId: string,
  input: CreateResumeInput
) => {
  const resume = new Resume({
    userId: new Types.ObjectId(userId),
    fileName: input.fileName,
    fileUrl: input.fileUrl,
    fileType: input.fileType,
    fileSize: input.fileSize,
    status: "uploaded",
  });

  await resume.save();

  return {
    id: resume._id,
    userId: resume.userId,
    fileName: resume.fileName,
    fileUrl: resume.fileUrl,
    fileType: resume.fileType,
    fileSize: resume.fileSize,
    status: resume.status,
    createdAt: resume.createdAt,
  };
};

export const getUserResumes = async (userId: string) => {
    const userObjectId = new Types.ObjectId(userId);

    return await Resume.find({ 
        userId: userObjectId,
    }).sort({ createdAt: -1 });
};

export const getResumeById = async (
  userId: string,
  resumeId: string
) => {
    const userObjectId = new Types.ObjectId(userId);
    const resumeObjectId = new Types.ObjectId(resumeId);

    const resume = await Resume.findOne({
        _id: resumeObjectId,
        userId: userObjectId,
    });

    if (!resume) {
        throw new AppError("Resume not found", 404);
    }

    return resume;
};

export const deleteResume = async (
    userId: string,
    resumeId: string
) => {
    const userObjectId = new Types.ObjectId(userId);
    const resumeObjectId = new Types.ObjectId(resumeId);

    const resume = await Resume.findOneAndDelete({
        _id: resumeObjectId,
        userId: userObjectId,
    });

    if (!resume) {
        throw new AppError("Resume not found", 404);
    }

    return true;
};