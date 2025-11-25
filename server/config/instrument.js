// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: "https://f77c5110a973ee3a51e2792eb648dbe0@o4510412593954816.ingest.us.sentry.io/4510412606078976",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  integrations:[
    Sentry.mongooseIntegration(),
  ],
  sendDefaultPii: true,
});