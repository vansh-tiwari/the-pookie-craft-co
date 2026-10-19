import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline/promises";
const rl = createInterface({ input: process.stdin, output: process.stdout });
console.log(
  "Run in a private terminal. Input is visible; this tool prints only a salted password hash.",
);
const password = await rl.question(
  "New owner password (at least 12 characters): ",
);
rl.close();
if (password.length < 12) {
  console.error("Use at least 12 characters.");
  process.exit(1);
}
const salt = randomBytes(16).toString("hex");
console.log(
  `ADMIN_PASSWORD_HASH=${salt}:${scryptSync(password, salt, 64).toString("hex")}`,
);
