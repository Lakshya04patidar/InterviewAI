import { Document, Model, Schema, Types, model } from "mongoose";

export interface IResumeAnalysis extends Document {
    resumeId: Types.ObjectId;
    userId: Types.ObjectId;

    summary: string;
    skills: string[];
    strengths: string[];
    weaknesses: string[];
    experienceLevel: string;
    education: string[];
    missingSkills: string[];
    createdAt: Date;
    updatedAt: Date;
}

const resumeAnalysisSchema = new Schema<IResumeAnalysis>(
    {
        resumeId: {
            type: Schema.Types.ObjectId,
            ref: "Resume",
            required: true,
            index: true,
        },

        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        summary: {
            type: String,
            required: true,
        },

        skills: {
            type: [String],
            default: [],
        },

        strengths: {
            type: [String],
            default: [],
        },

        weaknesses: {
            type: [String],
            default: [],
        },

        experienceLevel: {
            type: String,
            required: true,
        },

        education: {
            type: [String],
            default: [],
        },
        missingSkills: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

export const ResumeAnalysis: Model<IResumeAnalysis> =
    model<IResumeAnalysis>(
        "ResumeAnalysis",
        resumeAnalysisSchema
    );