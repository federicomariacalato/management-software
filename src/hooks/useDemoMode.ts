import { useOutletContext } from "react-router-dom";

export type DashboardOutletContext = { isDemo: boolean };

export const DEMO_DISABLED_HINT = "Not available in demo mode";

// DashboardLayout passes isDemo to every page through the Outlet context,
// so table rows don't each open their own auth subscription.
export function useDemoMode(): boolean {
  return useOutletContext<DashboardOutletContext>().isDemo;
}
