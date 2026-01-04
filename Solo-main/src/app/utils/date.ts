/**
 * Utilities for working with dates in the *user's local timezone*.
 *
 * We intentionally avoid comparing full timestamps because due dates and
 * completion timestamps are stored in ISO format (often UTC). When shown in
 * the UI, users expect date-based grouping ("today", "tomorrow") to follow
 * their local calendar.
 */

/** Returns local date key in the format YYYY-MM-DD. */
export function toLocalDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Returns local date key for an ISO string (or undefined). */
export function isoToLocalDateKey(iso?: string): string | null {
  if (!iso) return null;
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return null;
  return toLocalDateKey(dt);
}

/** Create an ISO string for a due date anchored at local noon to avoid DST edges. */
export function makeDueDateISO(date: Date): string {
  const localNoon = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
  return localNoon.toISOString();
}

/**
 * Returns true if the given ISO date is on the same local calendar day as `date`.
 */
export function isSameLocalDay(iso: string | undefined, date: Date): boolean {
  const a = isoToLocalDateKey(iso);
  return a !== null && a === toLocalDateKey(date);
}
