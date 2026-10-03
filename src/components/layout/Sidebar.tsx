import { NavLink } from "react-router-dom";
import { navItems } from "./navItems";

export function Sidebar() {
  return (
    <aside className="hidden w-64 h-screen border-r bg-background md:flex flex-col p-4">
      <div className="text-xl font-bold px-2 py-4">Ecommerce Admin</div>
      <nav aria-label="Main navigation" className="flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground"
              }`
            }
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
