import { Button } from "../ui/button";
import { supabase } from "@/lib/supabaseClient";
import { LogOut } from "lucide-react";

type HeaderProps = {
  email: string | undefined;
};

export function Header({ email }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 h-16 border-b bg-background flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold">Management software</h2>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold uppercase">
            {email?.charAt(0)}
          </div>
          <span className="text-sm text-muted-foreground max-w-48 truncate">
            {email}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => supabase.auth.signOut()}
        >
          <LogOut />
          Esci
        </Button>
      </div>
    </header>
  );
}
