const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const env = {
  port: parseInt(process.env.PORT || "3001", 10),
  databaseUrl: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/url_shortener",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  baseUrl: process.env.BASE_URL || "http://localhost:3001",
};

// log which env vars are set (hides actual values for security)
console.log("ENV CHECK:", {
  DATABASE_URL: env.databaseUrl ? env.databaseUrl.substring(0, 25) + "..." : "NOT SET",
  PORT: env.port,
  FRONTEND_URL: env.frontendUrl,
  BASE_URL: env.baseUrl,
});

module.exports = { env };
