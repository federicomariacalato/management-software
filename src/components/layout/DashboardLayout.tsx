import { Navigate, Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileNavbar } from "./MobileNavbar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/button";
import { supabase } from "@/lib/supabaseClient";
import { ShieldAlert } from "lucide-react";

export function DashboardLayout() {
  const { session, isLoading, isAdmin } = useAuth();

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Caricamento...
      </div>
    );

  if (!session) return <Navigate to="/login" replace />;

  if (!isAdmin)
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
        <div className="w-full max-w-sm rounded-xl border bg-background p-6 text-center space-y-4 shadow-sm">
          <ShieldAlert className="mx-auto h-10 w-10 text-destructive" />
          <div className="space-y-1">
            <h1 className="text-lg font-semibold">Accesso non consentito</h1>
            <p className="text-sm text-muted-foreground">
              Questo account non ha accesso al gestionale.
            </p>
          </div>
          <Button className="w-full" onClick={() => supabase.auth.signOut()}>
            Esci
          </Button>
        </div>
      </div>
    );
  return (
    <>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header email={session.user.email} />
          <main className="flex-1 min-w-0 p-6 pb-20 md:pb-6">
            <Outlet />
          </main>
        </div>
      </div>
      <MobileNavbar />
    </>
  );
}
