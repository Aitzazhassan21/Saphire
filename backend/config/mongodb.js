import mongoose from "mongoose";

// Serverless: enable command buffering so queries wait for connection
// instead of failing immediately. Use 8s timeout (enough for cold start).
mongoose.set("bufferCommands", true);
mongoose.set("bufferTimeoutMS", 8000);

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
