import { Router } from "express";
import { asyncHandler } from "../../shared/handlers/asyncHandler";
import { authenticate } from "../../middlewares/auth.middleware";
import { analyze, getAnalysis } from "./resumeAnalysis.controller";

const router = Router();

router.use(authenticate);

router.post("/:resumeId/analyze", asyncHandler(analyze));
router.get("/:resumeId/analysis", asyncHandler(getAnalysis));

export default router;