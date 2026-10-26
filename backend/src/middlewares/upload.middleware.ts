import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (_res, _file, cb) => {
        cb(null, "uploads/resumes");
    },

    filename: (_res, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}${path.extname(file.originalname)}`;

        cb(null, uniqueName);
    },
});

const fileFilter: multer.Options["fileFilter"] = (
    _req,
    file,
    cb
) => {
    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    
    if(allowedTypes.includes(file.mimetype)){
        cb(null, true);
    } else {
        cb(
            new Error("Only PDF, DOC, and DOCX files are allowed")
        );
    }
};

export const uploadResume = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});