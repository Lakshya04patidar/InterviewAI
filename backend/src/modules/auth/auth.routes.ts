import { Router } from "express";
import { getMe, login, register, refreshToken, logout } from "./auth.controller";
import { asyncHandler } from "../../shared/handlers/asyncHandler";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.get("/me", authenticate, asyncHandler(getMe));
router.post("/refresh-token", asyncHandler(refreshToken));
router.post("/logout", authenticate, asyncHandler(logout));

export default router;