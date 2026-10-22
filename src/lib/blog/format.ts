/*
 * format.ts
 * Small, client-safe formatting helpers for blog UI.
 */

// Formats an ISO date as "22 Oct 2026" (UTC, so server and client agree).
export function formatPostDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(isoDate));
}

// Formats a reading time as "14 min read".
export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`;
}
