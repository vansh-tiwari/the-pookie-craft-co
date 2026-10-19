import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual, scryptSync } from "node:crypto";
const name = "pookie_owner";
const secret = () => {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 32)
    throw new Error("Admin session configuration is missing.");
  return s;
};
const sign = (value: string) =>
  createHmac("sha256", secret()).update(value).digest("hex");
export function equal(a: string, b: string) {
  const x = Buffer.from(a),
    y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
export function checkPassword(email: string, password: string) {
  const hash = process.env.ADMIN_PASSWORD_HASH || "";
  const [salt, expected] = hash.split(":");
  if (!process.env.ADMIN_EMAIL || !salt || !expected || expected.length !== 128)
    return false;
  return (
    equal(email.toLowerCase(), process.env.ADMIN_EMAIL.toLowerCase()) &&
    equal(scryptSync(password, salt, 64).toString("hex"), expected)
  );
}
export async function loggedIn() {
  try {
    const token = (await cookies()).get(name)?.value;
    if (!token) return false;
    const [value, signature] = token.split(".");
    const session = JSON.parse(Buffer.from(value, "base64url").toString());
    return (
      equal(sign(value), signature || "") &&
      session.exp > Date.now() &&
      session.email === process.env.ADMIN_EMAIL &&
      session.revision === sign(process.env.ADMIN_PASSWORD_HASH || "")
    );
  } catch {
    return false;
  }
}
export async function login() {
  const value = Buffer.from(
    JSON.stringify({
      email: process.env.ADMIN_EMAIL,
      exp: Date.now() + 8 * 60 * 60 * 1000,
      revision: sign(process.env.ADMIN_PASSWORD_HASH || ""),
    }),
  ).toString("base64url");
  (await cookies()).set(name, `${value}.${sign(value)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 8 * 60 * 60,
  });
}
export async function logout() {
  (await cookies()).delete(name);
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !!origin && origin === new URL(request.url).origin;
}
