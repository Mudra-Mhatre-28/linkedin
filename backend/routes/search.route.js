import express from "express";
import { search, searchSuggestions } from "../controllers/search.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Main search
router.get("/", protectRoute, search);

// Suggestions while typing
router.get("/suggestions", protectRoute, searchSuggestions);

export default router;