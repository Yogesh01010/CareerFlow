const { Webhook } = require("svix");
const User = require("../models/User.js");

const clerkWebhooks = async (req, res) => {
  console.log("Webhook hit");

  try {
    // req.body is a Buffer because of express.raw()
    const payload = req.body;

    // Create Svix webhook instance
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Verify headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Verify the event
    const event = whook.verify(payload, headers);

    // ✅ Get data & type from the VERIFIED event, not req.body
    const { data, type } = event;
    console.log("Event type:", type);

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          image: data.image_url,
          resume: "",
        };

        await User.create(userData);
        return res.json({ success: true });
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          image: data.image_url,
        };

        await User.findByIdAndUpdate(data.id, userData);
        return res.json({ success: true });
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        return res.json({ success: true });
      }

      default: {
        // Unknown event – just acknowledge
        return res.json({ received: true });
      }
    }
  } catch (error) {
    console.error("Webhook error:", error);
    return res
      .status(400)
      .json({ success: false, message: "Webhooks Error" });
  }
};

module.exports = clerkWebhooks;
