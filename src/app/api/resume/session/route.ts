/*
 * GET/POST/DELETE /api/resume/session
 * Admin sign-in for the resume editor. GET reports whether this browser holds
 * a valid session (and its CSRF token), POST {key} signs in, DELETE signs out.
 */

// ponytail: no rate limit on POST. The key is >= 32 random chars (>= 2^190
// guesses), so online guessing is infeasible; add a limiter if the key is ever
// replaced by a human-chosen password.

import type { NextRequest } from "next/server";
import { checkOrigin, errorResponse, jsonResponse, readJson } from "@/lib/engagement/request";
import { isRecord } from "@/lib/engagement/validate";
import {
  COOKIE_OPTIONS,
  checkAdminKey,
  createSession,
  csrfToken,
  isResumeEditable,
  isValidCsrf,
  isValidSession,
  SESSION_COOKIE,
} from "@/lib/resume/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NOT_SET_UP = "Resume editing is not set up.";

export function GET(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE)?.value;
  if (!isResumeEditable() || !session || !isValidSession(session)) {
    return jsonResponse({ admin: false });
  }
  return jsonResponse({ admin: true, csrf: csrfToken(session) });
}

export async function POST(request: NextRequest) {
  const forbidden = checkOrigin(request);
  if (forbidden) return forbidden;
  if (!isResumeEditable()) return errorResponse(503, NOT_SET_UP);

  const body = await readJson(request);
  if (!body.ok) return body.response;
  const input = body.data;
  if (!isRecord(input) || Array.isArray(input) || Object.keys(input).some((k) => k !== "key")) {
    return errorResponse(400, "Send only the admin key.");
  }
  if (typeof input.key !== "string" || input.key.length === 0) {
    return errorResponse(422, "Enter the admin key.", { key: "Enter the admin key." });
  }
  if (!checkAdminKey(input.key)) return errorResponse(401, "That key is not right.");

  const session = createSession();
  const response = jsonResponse({ admin: true, csrf: csrfToken(session.value) });
  response.cookies.set(SESSION_COOKIE, session.value, { ...COOKIE_OPTIONS, expires: session.expires });
  return response;
}

export function DELETE(request: NextRequest) {
  const forbidden = checkOrigin(request);
  if (forbidden) return forbidden;
  const session = request.cookies.get(SESSION_COOKIE)?.value;
  if (!session || !isValidSession(session)) return errorResponse(401, "You are not signed in.");
  if (!isValidCsrf(session, request.headers.get("x-csrf-token"))) {
    return errorResponse(403, "Forbidden.");
  }

  const response = jsonResponse({ admin: false });
  response.cookies.set(SESSION_COOKIE, "", { ...COOKIE_OPTIONS, maxAge: 0 });
  return response;
}
