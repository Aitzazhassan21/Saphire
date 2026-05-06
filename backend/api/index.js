import app from '../server.js';
import connectDB from '../config/mongodb.js';
import connectCloudinary from '../config/cloudinary.js';
import mongoose from 'mongoose';

let isInitialized = false;
let initError = null;

async function initialize() {
  if (isInitialized) return;
  if (initError) throw initError;

  try {
    console.log("[Serverless] Initializing connections...");
    await connectDB();
    await connectCloudinary();
    isInitialized = true;
    console.log("[Serverless] Initialization complete. Mongoose readyState:", mongoose.connection.readyState);
  } catch (error) {
    initError = error;
    console.error("[Serverless] Initialization failed:", error.message);
    throw error;
  }
}

function isDbReady() {
  return mongoose.connection.readyState === 1; // 1 = connected
}

// Wrapper to ensure initialization before handling requests
export default async function handler(req, res) {
  try {
    await initialize();

    if (!isDbReady()) {
      console.error("[Serverless] DB not ready. readyState:", mongoose.connection.readyState);
      return res.status(503).json({
        success: false,
        message: "Database connection is not ready. Please retry in a few seconds."
      });
    }

    // Forward to express app
    return app(req, res);
  } catch (error) {
    console.error("[Serverless] Request failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server initialization failed: " + error.message,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
