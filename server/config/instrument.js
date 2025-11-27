const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://f77c5110a973ee3a51e2792eb648dbe0@o4510412593954816.ingest.us.sentry.io/4510412606078976",
  
  integrations: [
    Sentry.mongooseIntegration(),
  ],

  sendDefaultPii: true,
});
