import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { supabase } from "@/lib/supabaseClient";
import { LogOut } from "lucide-react";

type HeaderProps = {
  email: string | undefined;
  isDemo: boolean;
};

export function Header({ email, isDemo }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 h-16 border-b bg-background flex items-center justify-between px-6">
      <div className="flex items-center gap-3 min-w-0">
        <h2 className="text-lg font-semibold truncate">Management software</h2>
        {isDemo && (
          <Badge
            variant="secondary"
            title="Changes you make are not saved and disappear when you reload the page"
          >
            Demo · changes aren't saved
          </Badge>
        )}
      </div>
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
          Sign out
        </Button>
      </div>
    </header>
  );
}
