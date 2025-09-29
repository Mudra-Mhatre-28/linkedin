import dotenv from "dotenv";
import path from "path";

// Explicitly load .env from backend folder
dotenv.config({ path: path.resolve("./backend/.env") });

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

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = pathModule.resolve();

(async () => {
	try {
		// Debug: Check if MONGO_URI loads
		console.log("Loading .env...");
		console.log("MONGO_URI =", process.env.MONGO_URI);

		if (!process.env.MONGO_URI) {
			throw new Error("MONGO_URI is not defined in .env");
		}

		await connectDB();
		console.log(" MongoDB connected successfully");

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

		app.use("/api/v1/auth", authRoutes);
		app.use("/api/v1/users", userRoutes);
		app.use("/api/v1/posts", postRoutes);
		app.use("/api/v1/notifications", notificationRoutes);
		app.use("/api/v1/connections", connectionRoutes);

		if (process.env.NODE_ENV === "production") {
			app.use(express.static(pathModule.join(__dirname, "/frontend/dist")));

			app.get("*", (req, res) => {
				res.sendFile(pathModule.resolve(__dirname, "frontend", "dist", "index.html"));
			});
		}

		app.listen(PORT, () => {
			console.log(` Server running on port ${PORT}`);
		});
	} catch (error) {
		console.error(" Error starting server:", error);
		process.exit(1);
	}
})();
