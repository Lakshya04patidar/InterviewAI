import { Request, Response } from "express";
import { updateProfileSchema, changePasswordSchema } from "./user.validation";
import { updateUserProfile, changeUserPassword, deleteUserAccount } from "./user.service";
import { sendSuccess } from "../../shared/responses/apiResponse";
import { AppError } from "../../shared/errors/AppError";

export const updateProfile = async (
    req: Request,
    res: Response
) => {
    if(!req.user){
        throw new AppError("Authenticationn required", 401);
    }

    const validatedData = updateProfileSchema.parse(req.body);

    const user = await updateUserProfile(
        req.user.id,
        validatedData
    );

    return sendSuccess({
        res,
        message: "Profile updated successfully",
        data: user,
    });
};

export const changePassword = async (
  req: Request,
  res: Response
) => {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }

  const validatedData = changePasswordSchema.parse(req.body);

  await changeUserPassword(
    req.user.id,
    validatedData.currentPassword,
    validatedData.newPassword
  );

  return sendSuccess({
    res,
    message: "Password changed successfully",
  });
};

export const deleteAccount = async(
    req: Request,
    res: Response
) => {
    if(!req.user){
        throw new AppError("Authentication required", 401);
    }

    await deleteUserAccount(req.user.id);

    return sendSuccess({
        res,
        message: "Account deleted successfully",
    });
};