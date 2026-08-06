import dotenv from "dotenv";

dotenv.config();

const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

if (!accessSecret) {
    throw new Error("JWT_ACCESS_SECRET is not configured");
}

if (!refreshSecret) {
    throw new Error("JWT_REFRESH_SECRET is not configured");
}

export const jwtConfig = {
    accessSecret,
    refreshSecret,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
}