import app from "./app";
import * as http from "http";
import { initDB } from "./db";

const port = process.env.PORT || 8080;

// Create server explicitly for better control
const server = http.createServer(app);

// Set request timeout to prevent hanging requests
server.timeout = 30000; // 30 seconds

// Initialize database then start server
initDB()
  .then(() => {
    // Start server only after database is initialized
    server.listen(Number(port), '0.0.0.0', () => {
      console.log(`Server running at http://0.0.0.0:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1); // Exit with error code if DB initialization fails
  });

// Handle graceful shutdown with proper signal handlers
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

// Handle unhandled rejections to keep the event loop running
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Don't exit the process, just log the error
});
