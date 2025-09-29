import dotenv from "dotenv";
import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import pathModule from "path";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";
import connectionRoutes from "./routes/connection.route.js";

import { connectDB } from "./lib/db.js";
import mongoose from "mongoose";

// Explicitly load .env from backend folder
dotenv.config({ path: path.resolve("./backend/.env") });

const app = express();
const PORT = process.env.PORT || 5000; // Render provides PORT
const __dirname = pathModule.resolve();

(async () => {
	try {
		console.log("Loading .env...");

		if (!process.env.MONGO_URI) {
			throw new Error("MONGO_URI is not defined in .env");
		}

		// Connect to MongoDB (no deprecated options)
		await mongoose.connect(process.env.MONGO_URI);
		console.log("MongoDB connected successfully");

		// Connect additional DB logic if needed
		await connectDB();

		// Middleware
		if (process.env.NODE_ENV !== "production") {
			app.use(
				cors({
					origin: process.env.CLIENT_URL || "http://localhost:5173",
					credentials: true,
				})
			);
		}

		app.use(express.json({ limit: "5mb" }));
		app.use(cookieParser());

		// API Routes
		app.use("/api/v1/auth", authRoutes);
		app.use("/api/v1/users", userRoutes);
		app.use("/api/v1/posts", postRoutes);
		app.use("/api/v1/notifications", notificationRoutes);
		app.use("/api/v1/connections", connectionRoutes);

		// Serve frontend in production
		if (process.env.NODE_ENV === "production") {
			app.use(express.static(pathModule.join(__dirname, "/frontend/dist")));

			app.get("*", (req, res) => {
				res.sendFile(pathModule.resolve(__dirname, "frontend", "dist", "index.html"));
			});
		}

		// Start server
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	} catch (error) {
		console.error("Error starting server:", error);
		process.exit(1);
	}
})();
