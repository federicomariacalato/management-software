import type { User } from "@supabase/supabase-js";

// Roles live in app_metadata, which only the server can change.
// The demo role is read-only in the database: see the ecommerce schema.
export function isAdminUser(user: User | null | undefined): boolean {
  return user?.app_metadata.role === "admin";
}

export function isDemoUser(user: User | null | undefined): boolean {
  return user?.app_metadata.role === "demo";
}

export function canAccessDashboard(user: User | null | undefined): boolean {
  return isAdminUser(user) || isDemoUser(user);
}
