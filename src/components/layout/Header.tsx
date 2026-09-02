export function Header() {
  return (
    <header className="sticky top-0 z-10 h-16 border-b bg-background flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold">Dashboard</h2>
      <div className="flex items-center gap-3">
        {/* placeholder per avatar/profilo, lo completiamo dopo */}
        <div className="h-8 w-8 rounded-full bg-muted" />
      </div>
    </header>
  );
}
