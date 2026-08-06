import app from "./app";
import {env} from "./config/env";
import { connectDB } from "./database/mongodb";
import logger from "./shared/logger/logger";


const startServer = async () => {
    try {
        await connectDB();

        app.listen(env.port, () => {
            logger.info(`🚀 Server running on http://localhost:${env.port}`);
        });
    } catch(error){
        logger.error("Failed to start server", error);
        process.exit(1);
    }
};

startServer();