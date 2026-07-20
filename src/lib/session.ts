import crypto from "node:crypto";

export interface SessionPayload {
  ok: true;
}

const COOKIE_NAME = "admin_session";
const ALGO = "sha256";

export function verifyPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function createSessionToken(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || "dev-secret";
  const nonce = crypto.randomBytes(16).toString("hex");
  const sig = crypto
    .createHmac(ALGO, secret)
    .update(nonce + secret)
    .digest("hex");
  return `${nonce}.${sig}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const secret = process.env.ADMIN_SESSION_SECRET || "dev-secret";
  const [nonce, sig] = token.split(".");
  if (!nonce || !sig) return false;
  const expected = crypto
    .createHmac(ALGO, secret)
    .update(nonce + secret)
    .digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export const SESSION_COOKIE = COOKIE_NAME;
