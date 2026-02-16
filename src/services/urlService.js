const { pool } = require("../config/database");
const { generateShortCode } = require("../utils/generateCode");
const { isValidUrl } = require("../utils/validateUrl");
const { AppError } = require("../middleware/errorHandler");

const MAX_COLLISION_RETRIES = 10;

// validates the url, generates a short code, and saves it to the database
// retries up to 10 times if the generated code already exists
async function createShortUrl(originalUrl) {
  if (!originalUrl || typeof originalUrl !== "string") {
    throw new AppError(400, "URL is required");
  }

  const trimmedUrl = originalUrl.trim();

  if (!isValidUrl(trimmedUrl)) {
    throw new AppError(400, "Invalid URL. Must be a valid HTTP or HTTPS URL.");
  }

  // if this url was already shortened before, return the existing record
  const existing = await pool.query(
    "SELECT id, original_url, short_code, click_count, created_at FROM urls WHERE original_url = $1",
    [trimmedUrl],
  );
  if (existing.rows.length > 0) {
    return existing.rows[0];
  }

  for (let attempt = 0; attempt < MAX_COLLISION_RETRIES; attempt++) {
    const shortCode = generateShortCode();

    try {
      const result = await pool.query(
        `INSERT INTO urls (original_url, short_code)
         VALUES ($1, $2)
         RETURNING id, original_url, short_code, click_count, created_at`,
        [trimmedUrl, shortCode],
      );
      return result.rows[0];
    } catch (error) {
      if (error.code === "23505" && error.constraint?.includes("short_code")) {
        continue;
      }
      throw error;
    }
  }

  throw new AppError(500, "Failed to generate unique short code. Please try again.");
}

// looks up a url record in the database by its short code
async function getUrlByShortCode(shortCode) {
  const result = await pool.query(
    "SELECT id, original_url, short_code, click_count, created_at FROM urls WHERE short_code = $1",
    [shortCode],
  );
  return result.rows[0] || null;
}

// adds 1 to the click count for a short code
async function incrementClickCount(shortCode) {
  await pool.query(
    "UPDATE urls SET click_count = click_count + 1 WHERE short_code = $1",
    [shortCode],
  );
}

module.exports = { createShortUrl, getUrlByShortCode, incrementClickCount };
