import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

import express from "express";
import { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";

import loadsRouter from "./api/loads";
import fmcsaRouter from "./api/fmcsa";
import { authMiddleware } from "./middleware/auth";

const app = express();

app.use(helmet());

app.use(cors());

// Middleware
app.use(express.json());

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Endpoint to check if load exists
app.use("/loads", authMiddleware, loadsRouter);

// Endpoint to check if the MC number is valid
app.use("/fmcsa", authMiddleware, fmcsaRouter);

// Error handling for non-existent routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint not found" });
});

export default app;
