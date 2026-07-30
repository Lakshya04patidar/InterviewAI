import dotenv from "dotenv";

dotenv.config();

const requireEnvWars = [
    "PORT",
    "MONGODB_URI",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET"
];

for(const key of requireEnvWars){
    if(!process.env[key]){
        throw new Error(`Missing required environment variable: ${key}`);
    }
}

export const env = {
    nodeEnv: process.env.NODE_ENV || "development",
    
    port: Number(process.env.PORT) || 5000,

    mongodbUri: process.env.MONGODB_URI!,

    jwt: {
        accessScret: process.env.JWT_ACCESS_SECRET!,
        refreshSecret: process.env.JWT_REFRESH_SECRET!,
        accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    },

    redisUrl: process.env.REDIS_URL || "",

    openAIKey: process.env.OPENAI_API_KEY || "",

    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
        region: process.env.AWS_REGION || "ap-south-1",
        bucket: process.env.AWS_S3_BUCKET || "",
    },

    clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
};