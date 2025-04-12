import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import {
  validateSessionToken,
  setSessionTokenCookie,
  deleteSessionTokenCookie,
} from "$lib/server/auth";

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
  return { user };
};

export const actions: Actions = {
  default: async (event) => {
    if (event.locals.user === null) {
      throw fail(401);
    }
  },
};
