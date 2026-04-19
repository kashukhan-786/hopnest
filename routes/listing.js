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
// ===================== TEMPORARY - CHECK CATEGORIES =====================
router.get("/check-categories", async (req, res) => {
  try {
    const categories = await Listing.distinct("category");
    const totalListings = await Listing.countDocuments();

    let html = `
      <h2 style="color:green; text-align:center; margin:40px 0 20px;">
        Total Listings in Database: ${totalListings}
      </h2>
      <h3 style="text-align:center;">Stored Categories:</h3>
      <pre style="background:#f8f9fa; padding:20px; font-size:16px; margin:20px auto; max-width:600px; border:1px solid #ddd;">
${JSON.stringify(categories, null, 2) || "No categories found"}
      </pre>
      <p style="text-align:center;">
        <a href="/listings" style="font-size:18px;">← Back to Listings Page</a>
      </p>
    `;

    res.send(html);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});
// ===================== END TEMPORARY ROUTE =====================
module.exports = router;
