import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../user/user.model";
import { AppError } from "../../shared/errors/AppError";
import { AUTH_PROVIDERS, USER_ROLES } from "../../shared/constants";
import { RegisterInput, LoginInput, RefreshTokenInput } from "./auth.validation";
import { jwtConfig } from "../../config/jwt";
import { createAuthTokens, compareRefreshToken } from "./auth.tokens";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";


export const registerUser = async (input: RegisterInput) => {
    const { fullName, email, password } = input;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new AppError("User with this email already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        role: USER_ROLES.STUDENT,
        provider: AUTH_PROVIDERS.LOCAL,
        isEmailVerified: false,
    });

    return {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        provider: user.provider,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
    };
};

export const loginUser = async (input: LoginInput) => {
    const { email, password } = input;

    const user = await User.findOne({ email }).select("+password");

    if(!user){
        throw new AppError("Invalid email or password", 401);
    }

    if(user.provider !== AUTH_PROVIDERS.LOCAL){
        throw new AppError("This account uses a different login method", 400);
    }

    if(!user.password){
        throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if(!isPasswordValid){
        throw new AppError("Invalid email or password", 401);
    }

    user.lastLogin = new Date();
    await user.save();

    const tokenPayload = {
        userId: user._id.toString(),
        role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);

    user.refreshTokenHash = refreshTokenHash;
    await user.save();

    return {
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            provider: user.provider,
            isEmailVerified: user.isEmailVerified,
            avatar: user.avatar,
            lastLogin: user.lastLogin,
        },
        accessToken,
        refreshToken,
    };
};

export const getCurrentUser = async (userId: string) => {
    const user = await User.findById(userId);

    if(!user){
        throw new AppError("User not found", 404);
    }

    return {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        provider: user.provider,
        isEmailVerified: user.isEmailVerified,
        avatar: user.avatar,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};

export const refreshUserToken = async (
    input: RefreshTokenInput
) => {
    const{ refreshToken } = input;

    let decoded: any;

    try{
        decoded = jwt.verify(
            refreshToken,
            jwtConfig.refreshSecret
        );
    } catch {
        throw new AppError("Invalid refresh token", 401);
    }
    const user = await User.findById(decoded.userId).select("+refreshTokenHash");

    if(!user){
        throw new AppError("User not found", 404);
    }

    if(!user?.refreshTokenHash){
        throw new AppError("Please login again", 401);
    }

    const isValid = await compareRefreshToken(
        refreshToken,
        user.refreshTokenHash
    );

    if(!isValid){
        throw new AppError("Refresh token expired", 401);
    }

    const tokens = await createAuthTokens(
        user._id.toString(),
        user.role
    );

    user.refreshTokenHash = tokens.refreshTokenHash;

    await user.save();

    return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
    };
};

export const logoutUser = async(userId: string) => {
    const user = await User.findById(userId);

    if (!user){
        throw new AppError("User not found", 404);
    }

    user.refreshTokenHash = undefined;
    await user.save();

    return true;
};