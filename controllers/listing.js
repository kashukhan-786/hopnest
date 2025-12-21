const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const MAP_TOKEN = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: MAP_TOKEN });

module.exports.index = async (req, res) => {
  const { category, location, search, minPrice, maxPrice } = req.query;

  let filter = {};

  // CATEGORY FILTER
  if (category && category !== "all") {
    filter.category = category.toLowerCase();
  }

  // SEARCH / LOCATION FILTER
  const searchTerm = search || location;
  if (searchTerm && searchTerm.trim() !== "") {
    filter.$or = [
      { title: { $regex: searchTerm, $options: "i" } },
      { location: { $regex: searchTerm, $options: "i" } },
    ];
  }

  // PRICE FILTER
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const allListings = await Listing.find(filter);
  res.render("listings/index", {
    allListings,
    selectedCategory: category || "all",
  });
};

/* =========================
   NEW FORM
========================= */
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

/* =========================
   SHOW LISTING
========================= */
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", {
    listing,
    MAP_TOKEN,
    imageUrl: listing.image?.url || "/default-image.jpg",
  });
};

/* =========================
   CREATE LISTING
========================= */
module.exports.createListing = async (req, res) => {
  const response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  const newListing = new Listing(req.body.listing);
  newListing.category = newListing.category.trim().toLowerCase();

  newListing.owner = req.user._id;
  newListing.image = {
    url: req.file.path,
    filename: req.file.filename,
  };
  newListing.geometry = response.body.features[0].geometry;

  await newListing.save();

  req.flash("success", "New listing created!");
  res.redirect(`/listings/${newListing._id}`);
};

/* =========================
   EDIT FORM
========================= */
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }

  const originalImageUrl = listing.image.url.replace(
    "/upload",
    "/upload/w_250"
  );

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

/* =========================
   UPDATE LISTING
========================= */
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  if (req.body.listing.category) {
    req.body.listing.category = req.body.listing.category.trim().toLowerCase();
  }

  const listing = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    await listing.save();
  }

  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};

/* =========================
   DELETE LISTING
========================= */
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};
