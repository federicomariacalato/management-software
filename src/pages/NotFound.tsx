import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <span className="text-sm font-medium text-muted-foreground">404</span>
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className={buttonVariants({ className: "mt-3" })}>
        Back to dashboard
      </Link>
    </div>
  );
}
