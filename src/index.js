require("dotenv").config();

const http = require("http");
const app = require("./app");
const { connectDb } = require("./config/db");

const PORT = process.env.PORT || 5005;

async function start() {
  await connectDb(process.env.MONGODB_URI);

  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`✅ BMPL Quotes backend listening on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
