const express = require("express");
const cors = require("cors");
const { env } = require("./config/env");
const urlRoutes = require("./routes/urlRoutes");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(cors({ origin: env.frontendUrl }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(urlRoutes);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});

module.exports = app;
