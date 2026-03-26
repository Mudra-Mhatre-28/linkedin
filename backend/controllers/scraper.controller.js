import { scrapeArticles } from "../services/scraper.service.js";

export const getScrapedArticles = async (req, res) => {
  try {
    const articles = await scrapeArticles();

    res.status(200).json({
      success: true,
      count: articles.length,
      articles
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};