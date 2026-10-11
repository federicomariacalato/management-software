import type { ReactNode } from "react";

type IdBadgeProps = {
  children: ReactNode;
};

export function IdBadge({ children }: IdBadgeProps) {
  return (
    <span className="rounded-full bg-indigo-100 px-2 py-0.5 font-mono text-xs font-medium text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
      {children}
    </span>
  );
}
