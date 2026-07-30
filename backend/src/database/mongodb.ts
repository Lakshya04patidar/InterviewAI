import mongoose from "mongoose";
import { env } from "../config/env";

export const connectDB = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(env.mongodbUri);

    console.log("✅ MongoDB Connected");
    console.log(`📦 Database: ${connection.connection.name}`);
    console.log(`🌐 Host: ${connection.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(error);

    process.exit(1);
  }
};