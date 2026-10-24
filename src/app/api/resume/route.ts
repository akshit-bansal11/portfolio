/*
 * PUT /api/resume
 * Saves the whole resume as a new revision (admin session + CSRF token
 * required), then revalidates /resume so the public page shows it.
 */

import type { NextRequest } from "next/server";
import { checkOrigin, errorResponse, jsonResponse, readJson } from "@/lib/engagement/request";
import { isResumeEditable, isValidCsrf, isValidSession, SESSION_COOKIE } from "@/lib/resume/auth";
import { saveResume } from "@/lib/resume/store";
import { RESUME_MAX_BYTES, validateResume } from "@/lib/resume/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Order: origin and config, then parse -> validate -> authorize -> save (BE-03).
// Auth fails closed: any doubt about the session or token rejects the write, and
// field errors are only shown to a signed-in admin.
export async function PUT(request: NextRequest) {
  const forbidden = checkOrigin(request);
  if (forbidden) return forbidden;
  if (!isResumeEditable()) return errorResponse(503, "Resume editing is not set up.");

  const body = await readJson(request, RESUME_MAX_BYTES);
  if (!body.ok) return body.response;
  const result = validateResume(body.data);

  const session = request.cookies.get(SESSION_COOKIE)?.value;
  if (!session || !isValidSession(session)) return errorResponse(401, "You are not signed in.");
  if (!isValidCsrf(session, request.headers.get("x-csrf-token"))) {
    return errorResponse(403, "Forbidden.");
  }
  if (!result.ok) {
    return errorResponse(result.status, "Some fields need fixing.", result.fields);
  }

  try {
    return jsonResponse({ ok: true, savedAt: await saveResume(result.value) });
  } catch (error) {
    console.error("resume save failed", error);
    return errorResponse(500, "Couldn't save. Please try again.");
  }
}
