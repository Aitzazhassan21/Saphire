import app from '../server.js';
import connectDB from '../config/mongodb.js';
import connectCloudinary from '../config/cloudinary.js';

// Initialize connections for serverless
await connectDB();
await connectCloudinary();

export default app;
