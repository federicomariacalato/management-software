import { supabase } from "@/lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { canAccessDashboard, isAdminUser, isDemoUser } from "@/lib/roles";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAdmin = isAdminUser(session?.user);
  const isDemo = isDemoUser(session?.user);
  const hasDashboardAccess = canAccessDashboard(session?.user);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  return { session, isLoading, isAdmin, isDemo, hasDashboardAccess };
}
