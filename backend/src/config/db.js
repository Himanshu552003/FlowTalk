import { ENV } from "./env.js";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("🔍 MONGO_URI from ENV:", ENV.MONGO_URI);
    const conn = await mongoose.connect(ENV.MONGO_URI);
    console.log("✅ MongoDB connected successfully:", conn.connection.host);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    throw error;
  }
};

export default connectDB;