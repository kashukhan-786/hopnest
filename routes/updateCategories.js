const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");

// Get all unique categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Listing.distinct("category");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Filter listings by category
router.get("/filter", async (req, res) => {
  const { category } = req.query;

  try {
    let filter = {};
    if (category) {
      // Case-insensitive regex match
      filter.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    const listings = await Listing.find(filter);
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: "Filter failed" });
  }
});

module.exports = router;
