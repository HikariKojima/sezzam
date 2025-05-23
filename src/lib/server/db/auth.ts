import { db } from "$lib/server/db/index";
import { eq } from "drizzle-orm";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";

import {
  sessionTable,
  customersTable,
  type Customers,
  type Session,
} from "$lib/server/db/schema.js";

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(
  token: string,
  userId?: number
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    customerId: userId ?? null,
  };
  await db.insert(sessionTable).values(session);
  return session;
}

export async function validateSessionToken(
  token: string
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const sessionResult = await db
    .select()
    .from(sessionTable)
    .where(eq(sessionTable.id, sessionId));

  if (sessionResult.length < 1) {
    return { session: null, user: null };
  }
  const session = sessionResult[0];

  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(sessionTable).where(eq(sessionTable.id, session.id));
    return { session: null, user: null };
  }
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await db
      .update(sessionTable)
      .set({
        expiresAt: session.expiresAt,
      })
      .where(eq(sessionTable.id, session.id));
  }

  if (!session.customerId) {
    return { session, user: null };
  }

  const userResult = await db
    .select()
    .from(customersTable)
    .where(eq(customersTable.id, session.customerId));

  if (userResult.length < 1) {
    return { session: null, user: null };
  }
  return { session, user: userResult[0] };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

export async function invalidateAllSessions(userId: number): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.customerId, userId));
}

export type SessionValidationResult =
  | { session: Session; user: Customers }
  | { session: null; user: null }
  | { session: Session; user: null };

import type { RequestEvent } from "@sveltejs/kit";

export function setSessionTokenCookie(
  event: RequestEvent,
  token: string,
  experiesAt: Date
): void {
  event.cookies.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: experiesAt,
  });
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
  event.cookies.set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
