export type KpiData = {
  label: string;
  value: string;
  /**
   * Relative change against the previous period, or `null` when that period
   * has no baseline to compare against. `null` must be rendered as "no data",
   * never as `0`.
   */
  change: number | null;
  trend: number[];
};

export type KpiResult = {
  kpis: KpiData[];
  /**
   * False when the dataset holds no non-cancelled order inside the rolling
   * 30-day window, so the UI can show an explicit empty state instead of a
   * dashboard full of confident zeros.
   */
  hasSalesInPeriod: boolean;
};
