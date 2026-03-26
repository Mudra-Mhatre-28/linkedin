import express from "express";
import { getScrapedArticles } from "../controllers/scraper.controller.js";

const router = express.Router();

router.get("/articles", getScrapedArticles);

export default router;