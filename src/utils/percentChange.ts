/**
 * Percentage change between two periods.
 *
 * Returns `null` when there is no comparable baseline (`previous === 0`),
 * because the relative change is undefined rather than zero. Returning `0`
 * there made the UI render a green "+0%" badge, which reads as "no change"
 * when in fact growth from an empty period cannot be expressed as a
 * percentage.
 */
export function percentChange(
  current: number,
  previous: number,
): number | null {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}
