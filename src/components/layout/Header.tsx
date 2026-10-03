import { usePageTitle } from "./usePageTitle";

export function Header() {
  const title = usePageTitle();

  return (
    <header className="sticky top-0 z-10 h-16 border-b bg-background flex items-center justify-between px-6">
      <p aria-hidden="true" className="text-lg font-semibold">
        {title}
      </p>
      <div className="flex items-center gap-3">
        {/* placeholder per avatar/profilo, lo completiamo dopo */}
        <div
          className="h-8 w-8 rounded-full bg-muted"
          role="img"
          aria-label="User profile"
        />
      </div>
    </header>
  );
}
