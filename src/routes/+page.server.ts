import { db } from "$lib/server/db";
import type { PageServerLoad } from "./$types";
import { generateSessionToken, createSession } from "./api/auth";
import {
  setSessionTokenCookie,
  deleteSessionTokenCookie,
} from "$lib/server/cookies/cookies";

const token = generateSessionToken();
const session = createSession(token, userId);
setSessionTokenCookie();
