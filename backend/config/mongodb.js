import mongoose from "mongoose";

// CRITICAL: disable command buffering globally BEFORE any connection is created.
// In serverless, this prevents 'buffering timed out' when connection is slow/failing.
mongoose.set("bufferCommands", false);
mongoose.set("bufferTimeoutMS", 3000); // fail fast instead of buffering 10s

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
    serverSelectionTimeoutMS: 15000,    // 15s: cold-start + Atlas DNS/TLS can be slow
    connectTimeoutMS: 15000,            // 15s connection timeout
    socketTimeoutMS: 45000,           // 45s socket timeout
    bufferCommands: false,            // (also set globally above)
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
    cached.promise = mongoose
      .connect(uri, options)
      .then((m) => {
        cached.conn = m.connection;
        console.log("[MongoDB] Connected successfully");
        return cached.conn;
      })
      .catch((error) => {
        cached.promise = null;
        console.error("[MongoDB] Connection failed:", error.message);
        console.error("[MongoDB] Error code:", error.code || "N/A");
        throw error;
      });
  }

  await cached.promise;
  return true;
};

export default connectDB;
