import mongoose from "mongoose";
import { env } from "../config/env";
import logger from "../shared/logger/logger";

export const connectDB = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(env.mongodbUri);

    logger.info("✅ MongoDB Connected");
    logger.info(`📦 Database: ${connection.connection.name}`);
    logger.info(`🌐 Host: ${connection.connection.host}`);
  } catch (error) {
    logger.error("❌ MongoDB Connection Failed");
    throw error;

    process.exit(1);
  }
};