import { Router } from "express";
import { updateProfile, changePassword, deleteAccount } from "./user.controller";
import { asyncHandler } from "../../shared/handlers/asyncHandler";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.patch(
    "/me",
    authenticate,
    asyncHandler(updateProfile)
);

router.patch(
    "/change-password",
    authenticate,
    asyncHandler(changePassword)
);

router.delete(
    "/me",
    authenticate,
    asyncHandler(deleteAccount)
)
export default router;