import { Router } from "express";
import { asyncHandler } from "../../shared/handlers/asyncHandler";
import { authenticate } from "../../middlewares/auth.middleware";
import { create, getAll, getById, remove, removeResume, } from "./resume.controller";
import { uploadResume } from "../../middlewares/upload.middleware";

const router = Router();

router.use(authenticate);

router.post("/", uploadResume.single("resume"), asyncHandler(create));
router.get("/", asyncHandler(getAll));
router.get("/:id", asyncHandler(getById));
router.delete("/:id", asyncHandler(removeResume));

export default router;