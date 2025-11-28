require("./config/instrument.js");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db.js");
const Sentry = require("@sentry/node");
const clerkWebhooks = require("./controllers/webhooks.js");

// Initialize Express
const app = express();

// Connect to database (runs on cold start of the function)
connectDB()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("DB Error:", err));

// Webhook route needs raw body (for Clerk / Svix signature verification)
app.use("/webhooks", express.raw({ type: "*/*" }));

// Other middlewares (apply to all non-raw routes)
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("API Working"));

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.post("/webhooks", clerkWebhooks);

// Sentry error handler
Sentry.setupExpressErrorHandler(app);

// ❌ DO NOT CALL app.listen() ON VERCEL
// ✅ Instead, export the app so @vercel/node can use it as the handler
module.exports = app;
