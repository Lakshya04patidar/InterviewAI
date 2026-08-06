import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt";
import { UserRole } from "../shared/constants";

interface TokenPayload {
    userId: string;
    role: UserRole;
}

export const generateAccessToken = (payload: TokenPayload) => {
    return jwt.sign(payload, jwtConfig.accessSecret, {
        expiresIn: jwtConfig.accessExpiresIn as jwt.SignOptions["expiresIn"],
    });
};

export const generateRefreshToken = (payload: TokenPayload) => {
    return jwt.sign(payload, jwtConfig.refreshSecret, {
        expiresIn: jwtConfig.refreshExpiresIn as jwt.SignOptions["expiresIn"],
    });
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, jwtConfig.refreshSecret);
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, jwtConfig.accessSecret);
};