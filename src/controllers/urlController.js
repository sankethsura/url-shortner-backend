const { createShortUrl, getUrlByShortCode, incrementClickCount } = require("../services/urlService");
const { env } = require("../config/env");
const { AppError } = require("../middleware/errorHandler");

// takes a long url from the request body and returns a shortened url
async function shortenUrl(req, res) {
  try {
    const { url } = req.body;
    const record = await createShortUrl(url);
    res.status(201).json({
      id: record.id,
      originalUrl: record.original_url,
      shortCode: record.short_code,
      shortUrl: `${env.baseUrl}/${record.short_code}`,
      clickCount: record.click_count,
      createdAt: record.created_at,
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    console.error("Error shortening URL:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// looks up the short code and redirects the user to the original url
async function redirectToUrl(req, res) {
  try {
    const { shortCode } = req.params;

    if (!/^[A-Za-z0-9]{8}$/.test(shortCode)) {
      res.status(400).json({ error: "Invalid short code format" });
      return;
    }

    const record = await getUrlByShortCode(shortCode);
    if (!record) {
      res.status(404).json({ error: "Short URL not found" });
      return;
    }

    incrementClickCount(shortCode).catch((err) =>
      console.error("Failed to increment click count:", err),
    );

    res.redirect(301, record.original_url);
  } catch (error) {
    console.error("Error redirecting:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { shortenUrl, redirectToUrl };
