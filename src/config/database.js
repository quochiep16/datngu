const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI is missing in .env file");
    }

    await mongoose.connect(mongoUri);

    console.log("MongoDB connected successfully");
    console.log("MongoDB host:", mongoose.connection.host);
    console.log("MongoDB port:", mongoose.connection.port);
    console.log("MongoDB database:", mongoose.connection.name);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;