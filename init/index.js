// const mongoose = require("mongoose");
// const initData = require("./data.js");
// const Listing = require("../models/listing.js");

// main()
//   .then(() => console.log("connected to db"))
//   .catch((err) => console.log(err));

// async function main() {
//   await mongoose.connect("mongodb://127.0.0.1:27017/hopnest");
// }

// const initDB = async () => {
//   await Listing.deleteMany({});

//   const OWNER_ID = "691c87fd1bc934891e7533aa";

//   // ⭐ FIXED: create new dataset WITH owner
//   const updatedData = initData.data.map((obj) => ({
//     ...obj,
//     owner: OWNER_ID,
//   }));

//   await Listing.insertMany(updatedData);

//   console.log("data was initialized");
//   mongoose.connection.close();
// };

// initDB();
// const mongoose = require("mongoose");
// const Listing = require("../models/listing.js"); // adjust path if needed
// const { data } = require("./data.js"); // you exported sampleListings as data

// main()
//   .then(() => {
//     console.log("connected to db");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// async function main() {
//   await mongoose.connect("mongodb://127.0.0.1:27017/Hopnest"); // your DB
// }

// // delete old data first if needed
// await Listing.deleteMany({});

// await Listing.insertMany(data);
// console.log("Data inserted successfully");
// process.exit();
// import mongoose from "mongoose";
// import Listing from "../models/listing.js";
// import { data } from "./data.js";

// async function main() {
//   // await mongoose.connect("mongodb://127.0.0.1:27017/hopnest");
//   // await mongoose.connect(process.env.ATLASDB_URL);
//   await mongoose.connect("mongodb+srv://kashish:<PASSWORD>@cluster0.ejx4x.mongodb.net/hopnest");
//   console.log("connected to db");
// }

// main().catch((err) => console.log(err));

// // delete previous entries
// await Listing.deleteMany({});
// await Listing.insertMany(data);

// console.log("Data inserted successfully");
// process.exit();
import mongoose from "mongoose";
import Listing from "../models/listing.js";
import { data } from "./data.js";

async function main() {
  await mongoose.connect(
    "mongodb+srv://ferhenhite_db_user:1wIY8Eq70BoXLDdR@cluster0.wv9pezu.mongodb.net/?appName=Cluster0"
  );

  console.log("Connected to DB");

  // delete old data
  await Listing.deleteMany({});
  console.log("Old data deleted");

  // insert new data
  await Listing.insertMany(data);
  console.log("New data inserted");

  process.exit();
}

main().catch((err) => console.log(err));
