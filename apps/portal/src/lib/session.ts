import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// TODO before this is ever customer-facing for real, this default needs
// to go away, same issue as the ops api's jwt secret default
const SESSION_SECRET = process.env.SESSION_SECRET || "portal-dev-secret";

export interface SessionPayload {
  portalUserId: number;
  opsCustomerId: number;
  companyName: string;
}

// Sarah asked for this to be longer during the pilot - customers were
// getting logged out mid-week and emailing Dana's team confused about it
export function signSession(payload: SessionPayload): string {
  return jwt.sign(payload, SESSION_SECRET, { expiresIn: "14d" });
}

export function verifySession(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, SESSION_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("portal_session")?.value;
  if (!token) return null;
  return verifySession(token);
}
