import type { PageServerLoad } from "./$types";
import {
  generateSessionToken,
  createSession,
  validateSessionToken,
  setSessionTokenCookie,
  deleteSessionTokenCookie,
} from "../lib/server/db/auth";

export const load: PageServerLoad = async (event) => {
  try {
    const token = event.cookies.get("session");

    if (!token) {
      const newToken = generateSessionToken();
      const newSession = await createSession(newToken);
      setSessionTokenCookie(event, newToken, newSession.expiresAt);
      return {
        session: newSession,
        user: null,
      };
    }

    const { session, user } = await validateSessionToken(token);
    if (!session) {
      const newToken = generateSessionToken();
      const newSession = await createSession(newToken);
      setSessionTokenCookie(event, newToken, newSession.expiresAt);
      return {
        session: newSession,
        user: null,
      };
    }

    return {
      session,
      user,
    };
  } catch (error) {
    console.error("Session error:", error);
    return {
      session: null,
      user: null,
      error: "Failed to validate session",
    };
  }
};
