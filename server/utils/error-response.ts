import type { Response } from "express";

export function safeError(
  res: Response,
  error: unknown,
  message = "Internal server error",
  statusCode = 500,
) {
  console.error(message, error);
  return res.status(statusCode).json({
    success: false,
    message,
  });
}
