import { Request, Response } from "express";
import {
  registerSchema,
  loginSchema,
} from "./auth.validation";

import {
  loginUser,
  registerUser,
  getCurrentUser,
  refreshUserToken,
  logoutUser,
} from "./auth.service";

import { sendSuccess } from "../../shared/responses/apiResponse";
import { AppError } from "../../shared/errors/AppError";
import { setRefreshTokenCookie, clearRefreshTokenCookie } from "./auth.cookies";

export const register = async (req: Request, res: Response) => {
  const validatedData = registerSchema.parse(req.body);

  const user = await registerUser(validatedData);

  return sendSuccess({
    res,
    statusCode: 201,
    message: "User registered successfully",
    data: user,
  });
};

export const login = async (req: Request, res: Response) => {
  const validatedData = loginSchema.parse(req.body);

  const result = await loginUser(validatedData);

  setRefreshTokenCookie(res, result.refreshToken);

  return sendSuccess({
    res,
    statusCode: 200,
    message: "Login successful",
    data: {
      user: result.user,
      accessToken: result.accessToken,
    },
  });
};

export const getMe = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }

  const user = await getCurrentUser(req.user.id);

  return sendSuccess({
    res,
    message: "Current user fetched successfully",
    data: user,
  });
};

export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError("Refresh token not found", 401);
  }

  const result = await refreshUserToken({
    refreshToken,
  });

  setRefreshTokenCookie(res, result.refreshToken);

  return sendSuccess({
    res,
    message: "Access token refreshed successfully",
    data: {
      accessToken: result.accessToken,
    },
  });
};

export const logout = async (req: Request, res: Response) => {
  if(!req.user){
    throw new AppError("Authentication required", 401);
  }

  await logoutUser(req.user.id);

  clearRefreshTokenCookie(res);

  return sendSuccess({
    res,
    message: "Logout successful",
  });
};