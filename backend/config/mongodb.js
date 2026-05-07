import mongoose from "mongoose";

// Serverless: enable command buffering so queries wait for connection
// instead of failing immediately. Use 30s timeout for Vercel cold starts.
mongoose.set("bufferCommands", true);
mongoose.set("bufferTimeoutMS", 30000);

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

  // Log connection attempt details
  console.log("[MongoDB] === CONNECTION ATTEMPT ===");
  console.log("[MongoDB] Full URI (masked):", uri.replace(/:([^@]+)@/, ':***@'));
  console.log("[MongoDB] Has query params:", uri.includes('?'));
  console.log("[MongoDB] Node env:", process.env.NODE_ENV);

  // Connection options for serverless environments
  const options = {
    serverSelectionTimeoutMS: 15000,    // 15s: cold-start + Atlas DNS/TLS can be slow
    connectTimeoutMS: 15000,            // 15s connection timeout
    socketTimeoutMS: 45000,           // 45s socket timeout
    maxPoolSize: 1,                   // single connection for serverless
  };

  // Cache the connection across serverless invocations (warm starts)
  // so we don't reconnect on every request.
  const globalKey = "__mongooseConnection";
  const cached = globalThis[globalKey] || (globalThis[globalKey] = { conn: null, promise: null });

  if (cached.conn) {
    return true;
  }

  if (!cached.promise) {
    console.log("[MongoDB] Starting mongoose.connect()...");
    cached.promise = mongoose
      .connect(uri, options)
      .then((m) => {
        cached.conn = m.connection;
        console.log("[MongoDB] ✅ Connected successfully!");
        console.log("[MongoDB] Connection readyState:", mongoose.connection.readyState);
        return cached.conn;
      })
      .catch((error) => {
        cached.promise = null;
        console.error("[MongoDB] ❌ Connection FAILED:", error.message);
        console.error("[MongoDB] Error name:", error.name);
        console.error("[MongoDB] Error code:", error.code || "N/A");
        throw error;
      });
  }

  console.log("[MongoDB] Awaiting connection promise...");
  await cached.promise;
  console.log("[MongoDB] Connection promise resolved. readyState:", mongoose.connection.readyState);
  return true;
};

export default connectDB;
