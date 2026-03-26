import User from "../models/user.model.js";
import Post from "../models/post.model.js";

/* -------------------------------
   MAIN SEARCH WITH FILTERS
-------------------------------- */

export const search = async (req, res) => {
  try {

    const { q, city, skill, project } = req.query;

    const userQuery = {};

    // Name search
    if (q) {
      userQuery.name = { $regex: q, $options: "i" };
    }

    // City filter
    if (city) {
      userQuery.location = { $regex: city, $options: "i" };
    }

    // Skills filter
    if (skill) {
      userQuery.skills = { $regex: skill, $options: "i" };
    }

    // Projects filter
    if (project) {
      userQuery.projects = { $regex: project, $options: "i" };
    }

    const users = await User.find(userQuery)
      .select("name profilePicture headline location skills projects username")
      .limit(20);

    let posts = [];

    if (q) {
      posts = await Post.find({
        content: { $regex: q, $options: "i" }
      }).populate("author", "name profilePicture");
    }

    res.json({ users, posts });

  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: error.message });
  }
};


/* -------------------------------
   SUGGESTIONS WHILE TYPING
-------------------------------- */

export const searchSuggestions = async (req, res) => {

  try {

    const { q } = req.query;

    if (!q) return res.json([]);

    const users = await User.find({
      name: { $regex: q, $options: "i" }
    })
      .select("name profilePicture headline username")
      .limit(6);

    res.json(users);

  } catch (error) {

    console.error("Suggestion error:", error);
    res.status(500).json({ message: "Suggestion failed" });

  }

};