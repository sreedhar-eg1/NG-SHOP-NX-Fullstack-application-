import { NextFunction, Request, Response } from "express";

export function errorHandler(
  err: Error & { status?: number },
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response {
  if (err.message === "UnauthorizedError") {
    return res.status(401).json({ message: "The user is not authorized" });
  }

  if (err.message === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }

  return res
    .status(500)
    .json({ message: err.message || "Internal server error" });
}
