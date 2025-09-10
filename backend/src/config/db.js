import { ENV } from "./env.js";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("🔍 MONGO_URI from ENV:", ENV.MONGO_URI); // debug line

    const conn = await mongoose.connect(ENV.MONGO_URI);
    console.log("✅ MongoDB connected successfully:", conn.connection.host);

  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    throw error; // important so Inngest sees the error
  }
};

export default connectDB;
