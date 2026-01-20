const mongoose = require("mongoose");

async function connectDb(uri) {
  if (!uri) {
    throw new Error("MONGODB_URI is missing. Set it in .env");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { autoIndex: true });

  console.log("✅ Connected to MongoDB");
}

module.exports = { connectDb };
