import { Link } from "@tanstack/react-router";
import { PraxisMark, Wordmark } from "./primitives";
import { cn } from "@/lib/utils";

const sections = [
  { hash: "roadmap", label: "Roadmap" },
  { hash: "pricing", label: "Pricing" },
  { hash: "beta", label: "Beta" },
] as const;

const linkClass =
  "label-mono rounded-sm px-2 py-2 text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-signal sm:px-3";

export function SiteHeader({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md",
        className,
      )}
    >
      <div className="mx-auto flex min-h-14 max-w-[1400px] flex-wrap items-center gap-x-6 px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5 py-3 text-foreground">
          <PraxisMark className="text-signal" />
          <Wordmark />
        </Link>

        <nav className="ml-auto flex flex-wrap items-center gap-0.5">
          <Link to="/" activeOptions={{ exact: true, includeHash: false }} className={linkClass}>
            Overview
          </Link>
          {sections.map((s) => (
            <Link key={s.hash} to="/" hash={s.hash} className={linkClass.replace(" data-[status=active]:text-signal", "")}>
              {s.label}
            </Link>
          ))}
          <Link to="/start" className={linkClass}>
            Start
          </Link>
          <Link to="/dashboard" className={linkClass}>
            Execution
          </Link>
          <Link
            to="/start"
            className="label-mono ml-2 hidden items-center border border-signal px-4 py-2 text-signal transition-colors hover:bg-signal hover:text-primary-foreground sm:inline-flex"
          >
            Start an Execution
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-2.5 text-muted-foreground">
          <PraxisMark className="h-4 w-4" />
          <Wordmark className="text-xs" />
        </div>
        <p className="label-mono text-muted-foreground">
          The shortest path between conviction and reality.
        </p>
        <p className="label-mono text-signal">Mission in. Product out.</p>
      </div>
    </footer>
  );
}
