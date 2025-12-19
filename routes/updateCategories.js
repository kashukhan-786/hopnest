const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");

// ✅ Get all unique categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Listing.distinct("category");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// ✅ Filter listings (USED BY UI)
router.get("/filter", async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};
    if (category && category !== "all") {
      filter.category = category.toLowerCase();
    }

    const listings = await Listing.find(filter);
    res.render("listings/index", { listings, category });
  } catch (err) {
    res.status(500).send("Filter failed");
  }
});

module.exports = router;
