// creates demo logins for local dev, mapped to whatever's in the
// driftwood-ops seed data. if you re-seed driftwood-ops and the ids
// come out different, update opsCustomerId below to match.

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  await prisma.portalUser.upsert({
    where: { email: "ops@fulfillco.example" },
    update: {},
    create: {
      email: "ops@fulfillco.example",
      passwordHash,
      opsCustomerId: 1,
      companyName: "Fulfillco",
    },
  });

  // added so we had a plus-tier account to demo the discount stuff with,
  // customer id 2 in driftwood-ops seed data
  await prisma.portalUser.upsert({
    where: { email: "hello@brightgear.example" },
    update: {},
    create: {
      email: "hello@brightgear.example",
      passwordHash,
      opsCustomerId: 2,
      companyName: "BrightGear",
    },
  });

  console.log("seeded demo portal users: ops@fulfillco.example and hello@brightgear.example (password123)");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
