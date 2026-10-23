/*
 * d1.ts
 * Server-only Cloudflare D1 client over the REST API (the site runs on
 * Vercel, so there is no Worker binding). Never import this from client code.
 * Values are always passed as bound parameters, never built into the SQL.
 */

const TIMEOUT_MS = 5000;

type D1Param = string | number | null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isEngagementConfigured(): boolean {
  return Boolean(
    process.env.CLOUDFLARE_ACCOUNT_ID &&
      process.env.CLOUDFLARE_D1_DATABASE_ID &&
      process.env.CLOUDFLARE_D1_API_TOKEN &&
      process.env.ENGAGEMENT_IP_SALT,
  );
}

// Narrows the D1 envelope and returns the first statement's rows.
function readRows(body: unknown): unknown[] {
  if (!isRecord(body)) throw new Error("D1: malformed response");
  if (body.success !== true) {
    const first = Array.isArray(body.errors) ? body.errors[0] : undefined;
    const message = isRecord(first) && typeof first.message === "string" ? first.message : "failed";
    throw new Error(`D1: ${message}`);
  }
  const statement = Array.isArray(body.result) ? body.result[0] : undefined;
  if (!isRecord(statement) || !Array.isArray(statement.results)) {
    throw new Error("D1: malformed result");
  }
  return statement.results;
}

// Runs one parameterised statement. Callers narrow each row to their own shape.
export async function d1Query(sql: string, params: D1Param[] = []): Promise<unknown[]> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/d1/database/${process.env.CLOUDFLARE_D1_DATABASE_ID}/query`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CLOUDFLARE_D1_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql, params }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: "no-store",
  });
  return readRows(await res.json());
}
