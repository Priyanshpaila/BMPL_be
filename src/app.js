const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { rateLimitQuotes } = require("./middleware/rateLimit");
const { notFound } = require("./middleware/notFound");
const { errorHandler } = require("./middleware/errorHandler");

const healthRoutes = require("./routes/health.routes");
const quotesRoutes = require("./routes/quotes.routes");
const quotesNotifyRoutes = require("./routes/quoteNotify.route")

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

const origin = process.env.CORS_ORIGIN;
app.use(
  cors({
    origin: origin && origin.length ? origin : true,
    credentials: true,
  })
);

// routes
app.use("/health", healthRoutes);
app.use("/api/quotes", rateLimitQuotes, quotesRoutes);
app.use("/api/quote-notify", quotesNotifyRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
