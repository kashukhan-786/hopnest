const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, validateListing } = require("../middleware.js");
const ListingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

/* =========================
   INDEX + CREATE
========================= */
router.route("/").get(wrapAsync(ListingController.index)).post(
  isLoggedIn, // still require login to create
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(ListingController.createListing)
);

/* =========================
   NEW LISTING FORM
========================= */
router.get("/new", isLoggedIn, ListingController.renderNewForm);

/* =========================
   SHOW + UPDATE + DELETE
========================= */
router
  .route("/:id")
  .get(wrapAsync(ListingController.showListing))
  .put(
    isLoggedIn, // login required
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(ListingController.updateListing)
  )
  .delete(
    isLoggedIn, // login required
    wrapAsync(ListingController.destroyListing)
  );

/* =========================
   EDIT FORM
========================= */
router.get(
  "/:id/edit",
  isLoggedIn, // login required
  wrapAsync(ListingController.renderEditForm)
);
// ===================== TEMPORARY ROUTE - CHECK CATEGORIES =====================
router.get("/check-categories", async (req, res) => {
  try {
    const total = await Listing.countDocuments();
    const categories = await Listing.distinct("category");

    let output = `<h2 style="color:green;text-align:center;margin:30px;">Total Listings: ${total}</h2>`;
    output += `<h3 style="text-align:center;">Stored Categories in DB:</h3>`;
    output += `<pre style="background:#f4f4f4;padding:20px;font-size:15px;max-width:700px;margin:20px auto;border:1px solid #ccc;">`;
    output += JSON.stringify(categories, null, 2) || "[] (No categories found)";
    output += `</pre>`;
    output += `<p style="text-align:center;"><a href="/listings">← Back to Listings</a></p>`;

    res.send(output);
  } catch (err) {
    res.send("Error: " + err.message);
  }
});
// ===================== END TEMPORARY =====================
module.exports = router;
