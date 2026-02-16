const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const env = {
  port: parseInt(process.env.PORT || "8000", 10),
  databaseUrl: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/url_shortener",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  baseUrl: process.env.BASE_URL || "http://localhost:8000",
};

module.exports = { env };
