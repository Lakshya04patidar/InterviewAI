import { Document, Model, Schema, Types, model } from "mongoose";

export type ResumeStatus =
  | "uploaded"
  | "processing"
  | "completed"
  | "failed";

export interface IResume extends Document {
  userId: Types.ObjectId;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  status: ResumeStatus;
  parsedText?: string;
  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema = new Schema<IResume>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    fileName: {
      type: String,
      required: true,
      trim: true,
    },

    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },

    fileType: {
      type: String,
      required: true,
      trim: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "uploaded",
        "processing",
        "completed",
        "failed",
      ],
      default: "uploaded",
      required: true,
    },

    parsedText: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Resume: Model<IResume> = model<IResume>(
  "Resume",
  resumeSchema
);