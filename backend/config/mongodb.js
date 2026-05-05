import mongoose from "mongoose";

const connectDB = async () => {
  const rawUri = process.env.MONGODB_URI;
  if (!rawUri) {
    console.error("[MongoDB] Missing MONGODB_URI environment variable");
    throw new Error("Missing MONGODB_URI");
  }

  // Parse and prepare URI
  let uri = rawUri.trim();

  const hasDbName = (() => {
    try {
      const parsed = new URL(uri);
      return parsed.pathname && parsed.pathname !== "/";
    } catch {
      return uri.includes("/") && !uri.endsWith("/");
    }
  })();

  if (!hasDbName) {
    const [base, query] = uri.split("?");
    uri = `${base.replace(/\/+$/, "")}/trendify${query ? `?${query}` : ""}`;
  }

  console.log("[MongoDB] Connecting to:", uri.replace(/:([^@]+)@/, ':***@'));

  // Connection options for serverless environments
  const options = {
    serverSelectionTimeoutMS: 5000,    // 5 second timeout
    connectTimeoutMS: 5000,              // 5 second connection timeout
    socketTimeoutMS: 45000,            // 45 second socket timeout
    bufferCommands: false,              // Don't buffer commands if not connected
    maxPoolSize: 1,                     // Single connection for serverless
  };

  try {
    await mongoose.connect(uri, options);
    console.log("[MongoDB] Connected successfully");
    return true;
  } catch (error) {
    console.error("[MongoDB] Connection failed:", error.message);
    console.error("[MongoDB] Error code:", error.code || 'N/A');
    throw error; // Re-throw so caller knows connection failed
  }
};

export default connectDB;
