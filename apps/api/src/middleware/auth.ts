import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";

export interface AuthedRequest extends Request {
  user?: { id: number; role: string };
}

// warehouse staff logins go through this. customer-facing stuff (there
// isn't much) uses a different flow, see the old confluence doc if it
// still exists somewhere
export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: "missing auth header" });
  }

  const token = header.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as any;
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    res.status(401).json({ error: "invalid token" });
  }
}

export function requireRole(role: string) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ error: "forbidden" });
    }
    next();
  };
}
