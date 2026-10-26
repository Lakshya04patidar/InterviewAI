import { Types } from "mongoose";
import { AppError } from "../../shared/errors/AppError";
import { Resume } from "../resume/resume.model";
import { ResumeAnalysis } from "./resumeAnalysis.model";
import { resumeAnalysisSchema } from "./resumeAnalysis.validation";

export const analyzeResume = async (
  userId: string,
  resumeId: string
) => {
  // Validate Resume ID
  if (!Types.ObjectId.isValid(resumeId)) {
    throw new AppError("Invalid resume ID", 400);
  }

  const userObjectId = new Types.ObjectId(userId);
  const resumeObjectId = new Types.ObjectId(resumeId);

  // Find resume belonging to logged-in user
  const resume = await Resume.findOne({
    _id: resumeObjectId,
    userId: userObjectId,
  });

  if (!resume) {
    throw new AppError("Resume not found", 404);
  }

  // Resume must be parsed
  if (!resume.parsedText) {
    throw new AppError(
      "Resume text is not available for analysis",
      400
    );
  }

  if (resume.status !== "completed") {
    throw new AppError(
      "Resume parsing is not completed yet",
      400
    );
  }

  /*
   * Temporary mock AI analysis.
   *
   * This allows us to develop and test the complete
   * Resume Analysis backend without an OpenAI API key.
   *
   * Later this block will be replaced with the actual
   * OpenAI API call.
   */
  const mockAnalysis = {
    summary:
      "Software engineering candidate with experience in web development, programming, and modern development technologies.",

    skills: [
      "C++",
      "Python",
      "JavaScript",
      "HTML",
      "CSS",
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
    ],

    strengths: [
      "Full-stack web development",
      "Programming fundamentals",
      "Backend development",
      "Database knowledge",
      "Problem solving",
    ],

    weaknesses: [
      "Limited professional experience",
      "Need stronger production-level project experience",
      "Could improve advanced system design knowledge",
    ],

    experienceLevel: "Entry Level",

    education: [
      "Bachelor's degree in Computer Science / related field",
    ],

    missingSkills: [
      "Docker",
      "Redis",
      "CI/CD",
      "AWS",
      "System Design",
      "Testing",
    ],
  };

  // Validate analysis before saving
  const validatedAnalysis =
    resumeAnalysisSchema.safeParse(mockAnalysis);

  if (!validatedAnalysis.success) {
    throw new AppError(
      "Resume analysis validation failed",
      500
    );
  }

  // Create or update analysis
  const analysis = await ResumeAnalysis.findOneAndUpdate(
    {
      resumeId: resumeObjectId,
      userId: userObjectId,
    },
    {
      resumeId: resumeObjectId,
      userId: userObjectId,
      ...validatedAnalysis.data,
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  return analysis;
};