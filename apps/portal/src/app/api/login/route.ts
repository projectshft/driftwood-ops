import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const user = await prisma.portalUser.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "invalid email or password" }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "invalid email or password" }, { status: 401 });
  }

  const token = signSession({
    portalUserId: user.id,
    opsCustomerId: user.opsCustomerId,
    companyName: user.companyName,
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set("portal_session", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return res;
}
