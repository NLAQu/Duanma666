const env = require("../config/env");
const app = require("./app");
const { initDb } = require("./db/init");

async function start() {
  try {
    await initDb();
    app.listen(env.port, () => {
      console.log(`API running on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

start();
