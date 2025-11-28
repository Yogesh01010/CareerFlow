require("./config/instrument.js");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db.js");
const Sentry = require("@sentry/node");
const clerkWebhooks = require("./controllers/webhooks.js");

// Initialize Express
const app = express();

// Connect to database (runs on cold start)
connectDB()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("DB Error:", err));

// ⚠️ Webhook route needs raw body, and MUST NOT go through express.json()
app.post("/webhooks",
  express.raw({ type: "*/*" }), // or "application/json" depending on Clerk setup
  clerkWebhooks
);

// Global middlewares for other routes
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("API Working"));

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

// Sentry error handler
Sentry.setupExpressErrorHandler(app);

// ❌ No app.listen on Vercel
// ✅ Export express app as handler
module.exports = app;
