const EUR_FORMATTER = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
});

/**
 * `Intl.NumberFormat` construction is expensive, and this runs once per table
 * row on every render. The instance is immutable and its `format()` is
 * stateless, so a single shared instance is reused for the whole app.
 */
export function formatCurrency(amount: number): string {
  return EUR_FORMATTER.format(amount);
}
