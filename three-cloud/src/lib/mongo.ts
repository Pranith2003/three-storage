import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:27017/";

if (!MONGO_URI) {
  throw new Error("MONGODB_URI is not defined");
}

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return; // Already connected
  }

  try {
    const db = await mongoose.connect(MONGO_URI, {
      dbName: "three-storage",
    });

    isConnected = true;
    console.log("✅ MongoDB connected:", db.connection.host);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};

export default connectDB;
