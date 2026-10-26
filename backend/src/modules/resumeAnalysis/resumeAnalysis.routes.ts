import { Router } from "express";
import { asyncHandler } from "../../shared/handlers/asyncHandler";
import { authenticate } from "../../middlewares/auth.middleware";
import { analyze } from "./resumeAnalysis.controller";

const router = Router();

router.use(authenticate);

router.post(
    "/:resumeId/analyze",
    asyncHandler(analyze)
);

export default router;