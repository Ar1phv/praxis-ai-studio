import { Compass, FileText, Hammer, PenTool, ShieldCheck } from "lucide-react";
import type { Agent, AgentId, AgentStatus } from "@/lib/mock-data";
import { Meter, MetaLabel, StatusTag } from "./primitives";
import { cn } from "@/lib/utils";

const icons: Record<AgentId, typeof Compass> = {
  orchestrator: Compass,
  product: FileText,
  builder: Hammer,
  designer: PenTool,
  qa: ShieldCheck,
};

const statusTone: Record<AgentStatus, "signal" | "muted" | "warn" | "danger"> = {
  executing: "signal",
  complete: "signal",
  queued: "muted",
  idle: "muted",
  blocked: "danger",
};

const statusLabel: Record<AgentStatus, string> = {
  executing: "Executing",
  complete: "Complete",
  queued: "Queued",
  idle: "Idle",
  blocked: "Blocked",
};

export function AgentCard({
  agent,
  className,
  persona,
  chip,
  coming = false,
}: {
  agent: Agent;
  className?: string;
  /** Optional persona name shown in mono under the agent name. */
  persona?: string;
  /** Optional build status chip, e.g. "In build". */
  chip?: string;
  /** Render a greyed out roadmap card without metrics. */
  coming?: boolean;
}) {
  const Icon = icons[agent.id];
  const tone = statusTone[agent.status];

  if (coming) {
    return (
      <article className={cn("panel flex flex-col opacity-50", className)}>
        <div className="flex items-start justify-between gap-3 border-b border-border p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center border border-border text-muted-foreground">
              <Icon className="h-4 w-4" strokeWidth={1.5} />
            </span>
            <h3 className="text-sm font-medium">{agent.name}</h3>
          </div>
          <StatusTag tone="muted">Coming</StatusTag>
        </div>
        <div className="p-4">
          <MetaLabel>Role</MetaLabel>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{agent.role}</p>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "panel group flex flex-col transition-colors hover:border-border-strong",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3 border-b border-border p-4">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-9 w-9 items-center justify-center border border-border",
              tone === "signal" ? "text-signal" : "text-muted-foreground",
            )}
          >
            <Icon className="h-4 w-4" strokeWidth={1.5} />
          </span>
          <div>
            <h3 className="text-sm font-medium">{agent.name}</h3>
            {persona && <p className="label-mono mt-1 text-signal">{persona}</p>}
            <MetaLabel className="mt-1 normal-case tracking-normal">{agent.role}</MetaLabel>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {chip && (
            <span className="label-mono border border-signal-dim px-2 py-0.5 text-signal">{chip}</span>
          )}
          <StatusTag tone={tone} pulse={agent.status === "executing"}>
            {statusLabel[agent.status]}
          </StatusTag>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div>
          <MetaLabel>Current task</MetaLabel>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{agent.currentTask}</p>
        </div>
        <div>
          <MetaLabel>Output generated</MetaLabel>
          <div className="mt-1.5 flex items-baseline justify-between gap-3">
            <p className="font-mono text-sm text-foreground/90">{agent.output}</p>
            <span className="label-mono text-muted-foreground">{agent.outputMeta}</span>
          </div>
        </div>
        <div className="mt-auto">
          <div className="mb-2 flex items-center justify-between">
            <MetaLabel>Utilization</MetaLabel>
            <span className="label-mono text-foreground/80">{agent.utilization}%</span>
          </div>
          <Meter value={agent.utilization} tone={tone === "danger" ? "danger" : tone} />
        </div>
      </div>
    </article>
  );
}

/** Small mono chip used to mark build status (In build, Coming, Planned). */
export function Chip({ children, active = false }: { children: string; active?: boolean }) {
  return (
    <span
      className={cn(
        "label-mono inline-flex w-fit border px-2 py-0.5",
        active ? "border-signal-dim text-signal" : "border-border text-muted-foreground",
      )}
    >
      {children}
    </span>
  );
}
