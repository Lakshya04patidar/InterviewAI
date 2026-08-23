import { Router } from "express";
import { asyncHandler } from "../../shared/handlers/asyncHandler";
import { authenticate } from "../../middlewares/auth.middleware";
import { create, getAll, getById, remove, } from "./resume.controller";

const router = Router();

router.use(authenticate);

router.post("/", asyncHandler(create));
router.get("/", asyncHandler(getAll));
router.get("/:id", asyncHandler(getById));
router.delete("/:id", asyncHandler(remove));

export default router;