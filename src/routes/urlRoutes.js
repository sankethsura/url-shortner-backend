const { Router } = require("express");
const { shortenUrl, redirectToUrl } = require("../controllers/urlController");

const router = Router();

router.post("/api/shorten", shortenUrl);
router.get("/:shortCode", redirectToUrl);

module.exports = router;
