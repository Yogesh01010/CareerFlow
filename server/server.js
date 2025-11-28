require("./config/instrument.js");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db.js");
const Sentry = require("@sentry/node");
const clerkWebhooks = require("./controllers/webhooks.js");

// Initialize Express
const app = express();

// Connect to database
connectDB()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("DB Error:", err));

  app.use("/webhooks", express.raw({ type: "*/*" }));
// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("API Working"));

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.post("/webhooks", clerkWebhooks);

// Port
const PORT = process.env.PORT || 5001;

// Sentry
Sentry.setupExpressErrorHandler(app);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
