import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware";
import { sendSuccess } from "./shared/responses/apiResponse";
import authRoutes from "./modules/auth/auth.routes";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/api/v1/auth", authRoutes);

app.get("/api/v1/health", (req, res) => {
    return sendSuccess({
        res,
        message: "InterviewAI Backend Running"
    });
});

app.use(errorHandler);

export default app;