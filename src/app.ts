import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

import express from "express";
import { Request, Response } from "express";

import loadsRouter from "./api/loads";
import fmcsaRouter from "./api/fmcsa";

const app = express();

// Middleware
app.use(express.json());

app.use("/loads", loadsRouter);
app.use("/fmcsa", fmcsaRouter);

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Error handling for non-existent routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint not found" });
});

export default app;
