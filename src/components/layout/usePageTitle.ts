import { useLocation } from "react-router-dom";

const TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/orders": "Orders",
  "/customers": "Customers",
  "/products": "Products",
};

/**
 * Resolves the current page title from the pathname. The header previously
 * hardcoded "Dashboard", so every route rendered an <h2>Dashboard</h2> above the
 * page's own <h1> — both wrong text and an inverted heading outline.
 */
export function usePageTitle(): string {
  const { pathname } = useLocation();
  return TITLES[pathname] ?? "Page not found";
}
