import type { PageServerLoad } from "./$types";
import {
  generateSessionToken,
  createSession,
  validateSessionToken,
  setSessionTokenCookie,
  deleteSessionTokenCookie,
} from "../lib/server/session/auth";

const token = generateSessionToken();
const session = createSession(token);
//setSessionTokenCookie(token);

export const load: PageServerLoad = async (event) => {
  const token = event.cookies.get("session") ?? null;
  if (token === null) {
    return new Response(null, {
      status: 401,
    });
  }

  const { session, user } = await validateSessionToken(token);
  if (session === null) {
    deleteSessionTokenCookie(event);
    return new Response(null, {
      status: 401,
    });
  }

  setSessionTokenCookie(event, token, session.expiresAt);
};
