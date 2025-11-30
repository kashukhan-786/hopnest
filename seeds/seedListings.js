const mongoose = require("mongoose");
const Listing = require("../models/listing.js"); // adjust path if needed
const { data } = require("./data.js"); // your sample listings file

mongoose.connect("mongodb://127.0.0.1:27017/hopnest", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
  console.log("Database connected");

  // Optional: Delete old listings
  await Listing.deleteMany({});

  // Insert sample listings
  await Listing.insertMany(data);
  console.log("Seeded successfully!");
  mongoose.connection.close();
});
