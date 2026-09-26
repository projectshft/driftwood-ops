import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "4000", 10),
  databaseUrl: process.env.DATABASE_URL || "postgres://localhost:5432/driftwood",
  rateEngineUrl: process.env.RATE_ENGINE_URL || "http://localhost:8080",
  // TODO before this ever runs somewhere real, don't ship a default secret
  jwtSecret: process.env.JWT_SECRET || "driftwood-dev-secret",
  sendgridKey: process.env.SENDGRID_API_KEY,
  sentryDsn: process.env.SENTRY_DSN,
  // shared secret for the customer portal service, see middleware/portalAuth.ts
  portalApiKey: process.env.PORTAL_API_KEY || "dev-portal-key",
};
