import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
  });

  const rawUri = process.env.MONGODB_URI;
  if (!rawUri) {
    throw new Error("Missing MONGODB_URI in backend/.env");
  }

  // Allow MONGODB_URI to be either:
  // - a full connection string (including db name and query params)
  // - a base connection string (we'll append /trendify)
  let uri = rawUri.trim();

  const hasDbName = (() => {
    // For both mongodb:// and mongodb+srv:// forms.
    // If path is empty or '/', treat as no DB name.
    try {
      const parsed = new URL(uri);
      return parsed.pathname && parsed.pathname !== "/";
    } catch {
      // If it's not a valid URL, we'll fall back to simple heuristics.
      return uri.includes("/") && !uri.endsWith("/");
    }
  })();

  if (!hasDbName) {
    // If there's a query string, the db name must be inserted before it.
    const [base, query] = uri.split("?");
    uri = `${base.replace(/\/+$/, "")}/trendify${query ? `?${query}` : ""}`;
  }

  try {
    await mongoose.connect(uri);
  } catch (error) {
    console.error("MongoDB connection error:", error?.message || error);
  }
};

export default connectDB;
