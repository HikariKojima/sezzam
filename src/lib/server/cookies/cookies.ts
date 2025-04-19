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
