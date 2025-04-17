import { Request, Response, NextFunction } from "express";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Get the API key from environment variables
  const validApiKey = process.env.API_KEY;

  // Check if API key is configured in environment variables
  if (!validApiKey) {
    console.log("API key not configured in environment variables");
    res.status(500).json({
      error: "Server configuration error",
    });
    return;
  }

  // Get the API key from request headers
  const inputApiKey = req.header("X-API-Key");

  // Check if API key was provided in the request
  if (!inputApiKey) {
    res.status(401).json({
      error: "API Key missing",
    });
    return;
  }

  // Validate the provided API key
  if (inputApiKey !== validApiKey) {
    res.status(403).json({
      error: "Invalid API Key",
    });
    return;
  }

  // If API key is valid, proceed to the next middleware or route handler
  next();
};
