import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

export const connectDB = async () => {
    console.log("🔍 MONGO_URI in db.js:", process.env.MONGO_URI);
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not defined in .env");
    }

    try {
        await mongoose.connect(process.env.MONGO_URI); // removed deprecated options
        console.log("✅ MongoDB connected");
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        process.exit(1);
    }
};
