import { Request, Response, NextFunction } from "express";
import { config } from "../config";

// added when the customer portal team needed a way to pull order data
// without going through the staff JWT flow (that requires a warehouse
// staff login, portal users obviously don't have one). This was meant
// to be temporary until we had real service-to-service auth figured
// out. It's just a shared secret in a header. Don't expose these routes
// to the public internet without something better in front of them -
// this is fine for portal-service-to-api traffic inside the vpc, that's
// it.
export function requirePortalKey(req: Request, res: Response, next: NextFunction) {
  const key = req.headers["x-portal-api-key"];
  if (!key || key !== config.portalApiKey) {
    return res.status(401).json({ error: "invalid portal key" });
  }
  next();
}
