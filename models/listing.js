const mongoose = require("mongoose");
const Review = require("./review.js");

const { Schema } = mongoose;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  image: {
    filename: String,
    url: String,
  },

  price: Number,
  location: String,
  country: String,

  category: {
    type: String,
    lowercase: true,
    trim: true,
  },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// 🔥 Delete all reviews when listing is deleted
listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing && listing.reviews.length) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing =
  mongoose.models.Listing || mongoose.model("Listing", listingSchema);

module.exports = Listing;
