import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";

export const createAuthTokens = async (
    userId: string,
    role: string,
) => {
    const payload = {
        userId, 
        role,
    };

    const accessToken = generateAccessToken(payload as any);

    const refreshToken = generateRefreshToken(payload as any);

    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);

    return {
        accessToken,
        refreshToken,
        refreshTokenHash,
    };
};

export const compareRefreshToken = async (
    token: string,
    hash: string
) => {
    return bcrypt.compare(token, hash);
};