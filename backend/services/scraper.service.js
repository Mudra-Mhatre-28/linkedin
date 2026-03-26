import axios from "axios";
import * as cheerio from "cheerio";

export const scrapeArticles = async () => {
  try {
    const { data } = await axios.get("https://news.ycombinator.com");

    const $ = cheerio.load(data);
    const articles = [];

    $(".titleline a").each((i, el) => {
      const title = $(el).text();
      const link = $(el).attr("href");

      articles.push({
        title,
        link
      });
    });

    return articles;
  } catch (error) {
    console.error("Scraping failed:", error.message);
    throw error;
  }
};