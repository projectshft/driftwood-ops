// prints a staff JWT for local dev so you can curl the api. there's no
// login endpoint in this service - real staff tokens come from the ops
// dashboard's sso flow, which doesn't exist outside production.
//
//   curl -H "Authorization: Bearer $(npm run -s token)" localhost:4000/customers

import jwt from "jsonwebtoken";
import { config } from "../src/config";

const role = process.argv[2] || "staff";
process.stdout.write(jwt.sign({ id: 1, role }, config.jwtSecret, { expiresIn: "7d" }));
