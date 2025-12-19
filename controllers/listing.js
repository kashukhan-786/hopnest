// const Listing = require("../models/listing");
// const mbxGeocodeing = require("@mapbox/mapbox-sdk/services/geocoding");
// const MAP_TOKEN = process.env.MAP_TOKEN;
// const geocodingClient = mbxGeocodeing({ accessToken: MAP_TOKEN });
// module.exports.index = async (req, res) => {
//   const allListings = await Listing.find({});
//   res.render("listings/index.ejs", { allListings });
// };

// module.exports.renderNewForm = (req, res) => {
//   res.render("listings/new.ejs");
// };
// module.exports.showListing = async (req, res) => {
//   const { id } = req.params;
//   const listing = await Listing.findById(id)
//     .populate({ path: "reviews", populate: { path: "author" } })
//     .populate("owner");

//   if (!listing) {
//     req.flash("error", "Listing not found");
//     return res.redirect("/listings");
//   }

//   res.render("listings/show", { listing, MAP_TOKEN: process.env.MAP_TOKEN });
// };

// module.exports.createListing = async (req, res) => {
//   let response = await geocodingClient
//     .forwardGeocode({
//       query: req.body.listing.location,
//       limit: 1,
//     })
//     .send();

//   let url = req.file.path;
//   let filename = req.file.filename;

//   const newListing = new Listing(req.body.listing);
//   newListing.owner = req.user._id;
//   newListing.image = { url, filename };
//   newListing.geometry = response.body.features[0].geometry;
//   await newListing.save();
//   req.flash("success", "New listing created!");
//   res.redirect("/listings");
// };

// module.exports.renderEditForm = async (req, res) => {
//   const { id } = req.params;
//   const listing = await Listing.findById(id);
//   if (!listing) {
//     req.flash("error", "Listing you asked for does not exist!");
//     res.redirect("/listings");
//   }
//   let originalImageUrl = listing.image.url;
//   originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

//   res.render("listings/edit.ejs", { listing, originalImageUrl });
// };
// module.exports.updateListing = async (req, res) => {
//   const { id } = req.params;
//   let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//   if (typeof req.file !== "undefined") {
//     let url = req.file.path;
//     let filename = req.file.filename;
//     listing.image = { url, filename };
//     await listing.save();
//   }
//   req.flash("success", "listing updated!");
//   res.redirect(`/listings/${id}`);
// };
// module.exports.destroyListing = async (req, res) => {
//   const { id } = req.params;
//   await Listing.findByIdAndDelete(id);
//   req.flash("success", "listing deleted!");
//   res.redirect("/listings");
// };
// module.exports.index = async (req, res) => {
//   const allListings = await Listing.find({});
//   res.render("listings/index.ejs", {
//     allListings,
//     selectedCategory: null,
//   });
// };
const Listing = require("../models/listing");
const mbxGeocodeing = require("@mapbox/mapbox-sdk/services/geocoding");
const MAP_TOKEN = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocodeing({ accessToken: MAP_TOKEN });

// INDEX ROUTE (with search + category + price filters)
// module.exports.index = async (req, res) => {
// const { category, search, minPrice, maxPrice } = req.query;

// let filter = {};

// // CATEGORY FILTER
// if (category && category !== "all") {
//   filter.category = category;
// }

// // SEARCH FILTER (title + location)
// if (search) {
//   filter.$or = [
//     { title: { $regex: search, $options: "i" } },
//     { location: { $regex: search, $options: "i" } },
//   ];
// }
module.exports.index = async (req, res) => {
  const { category, location, minPrice, maxPrice } = req.query;

  let filter = {};

  // CATEGORY FILTER
  if (category && category !== "all") {
    filter.category = new RegExp(`^${category}$`, "i");
  }

  // LOCATION / SEARCH FILTER (FIXED)
  if (location) {
    filter.$or = [
      { title: { $regex: location, $options: "i" } },
      { location: { $regex: location, $options: "i" } },
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

// NEW FORM
module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

// SHOW ROUTE
// module.exports.showListing = async (req, res) => {
//   const { id } = req.params;
//   const listing = await Listing.findById(id)
//     .populate({
//       path: "reviews",
//       populate: { path: "author" },
//     })
//     .populate("owner");

//   if (!listing) {
//     req.flash("error", "Listing not found");
//     return res.redirect("/listings");
//   }
//   // console.log("Rendering listing page...");
//   res.render("listings/show.ejs", {
//     listing,
//     MAP_TOKEN: process.env.MAP_TOKEN,
//     imageUrl: listing.image?.url || "/default-image.jpg",
//   });
//   // res.render("./listings/show.ejs", { listing });
// };
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  try {
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

    // Safe render with defaults
    res.render("listings/show.ejs", {
      listing,
      MAP_TOKEN: process.env.MAP_TOKEN || "", // fallback
      imageUrl: listing.image?.url || "/default-image.jpg",
    });
  } catch (err) {
    console.error("Error fetching listing:", err);
    req.flash("error", "Something went wrong while fetching the listing");
    return res.redirect("/listings");
  }
};

// CREATE LISTING
module.exports.createListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  newListing.geometry = response.body.features[0].geometry;
  console.log("Saving coordinates:", response.body.features[0].geometry);

  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "New listing created!");
  res.redirect(`/listings/${newListing._id}`);
};

// EDIT ROUTE
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you asked for does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// UPDATE ROUTE
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (req.file) {
    listing.image = { url: req.file.path, filename: req.file.filename };
    await listing.save();
  }

  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};

// DELETE LISTING
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};
