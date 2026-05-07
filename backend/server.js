import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import contactRouter from "./routes/contactRoute.js";
import couponRouter from "./routes/couponRoute.js";
import reviewsRouter from "./routes/reviewsRoute.js";
import adminLeadsRouter from "./routes/adminLeadsRoute.js";
import adminReviewsRouter from "./routes/adminReviewsRoute.js";
import adminContactsRouter from "./routes/adminContactsRoute.js";
import orderRouter from "./routes/orderRoute.js";
import siteSettingsRouter from "./routes/siteSettingsRoute.js";
import newsletterRouter from "./routes/newsletterRoute.js";

// INFO: Create express app
const app = express();
const port = process.env.PORT || 4000;

// Initialize connections (always connect to DB and Cloudinary)
connectDB();
connectCloudinary();

// INFO: Middleware
app.use(express.json());
app.use(cors({
    origin: true,  // Reflects the request origin, works with credentials
    credentials: true  // Allow cookies/auth headers
}));

// INFO: API endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/products", productRouter); // Alias for /api/products
app.use("/api/contact", contactRouter);
app.use("/api/coupons", couponRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/admin/leads", adminLeadsRouter);
app.use("/api/admin/reviews", adminReviewsRouter);
app.use("/api/admin/contacts", adminContactsRouter);
app.use("/api/order", orderRouter);
app.use("/api/admin/settings", siteSettingsRouter);
app.use("/api/settings/public", siteSettingsRouter);
app.use("/api/newsletter", newsletterRouter);

// INFO: Health endpoint (useful for Vercel diagnostics)
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    timestamp: new Date().toISOString(),
    env: {
      mongodb_uri_set: !!process.env.MONGODB_URI,
      jwt_secret_set: !!process.env.JWT_SECRET,
      admin_email_set: !!process.env.ADMIN_EMAIL,
      admin_password_set: !!process.env.ADMIN_PASSWORD,
      node_env: process.env.NODE_ENV,
      vercel: !!process.env.VERCEL,
    },
  });
});

// INFO: Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// INFO: Start server (only if not in Vercel environment)
if (!process.env.VERCEL) {
  app.listen(port, () =>
    console.log(`Server is running on at http://localhost:${port}`)
  );
}

// INFO: Export for Vercel serverless
export default app;
