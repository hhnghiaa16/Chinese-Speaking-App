/**
 * Returns a colour hex string based on a 0–10 score.
 * 0–4   → red   (#F97373)
 * 5–7   → yellow (#F5C84B)
 * 8–10  → teal/green (#34D399)
 */
export function scoreColor(score: number): string {
  if (score >= 8) return '#34D399';
  if (score >= 5) return '#F5C84B';
  return '#F97373';
}
