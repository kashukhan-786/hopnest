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

module.exports = router;
