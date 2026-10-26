import fs from "fs/promises";
import path from "path";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import { AppError } from "../../shared/errors/AppError";

export const parseResumeFile = async (
  filePath: string,
  fileType: string
): Promise<string> => {
  const absolutePath = path.resolve(filePath);

  try {
    if (fileType === "application/pdf") {
      const buffer = await fs.readFile(absolutePath);

      const parser = new PDFParse({
        data: buffer,
      });

      const result = await parser.getText();

      await parser.destroy();

      return result.text.trim();
    }

    if (
      fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({
        path: absolutePath,
      });

      return result.value.trim();
    }

    throw new AppError(
      "Resume parsing is currently supported for PDF and DOCX files only",
      400
    );
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      "Failed to parse resume file",
      422
    );
  }
};