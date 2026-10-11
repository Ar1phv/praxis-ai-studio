import { useState, type FormEvent } from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";

const applicationSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Keep it under 100 characters"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email").max(255),
  xHandle: z
    .string()
    .trim()
    .min(1, "X handle is required")
    .max(50, "Keep it under 50 characters")
    .regex(/^@?[A-Za-z0-9_]{1,15}$/, "Enter a valid X handle"),
  idea: z
    .string()
    .trim()
    .min(1, "Tell us what you want to build")
    .max(2000, "Keep it under 2000 characters"),
});

export type BetaApplication = z.infer<typeof applicationSchema>;
type Errors = Partial<Record<keyof BetaApplication, string>>;

export type SubmitResult = { ok: true } | { ok: false; reason: "not_connected" };

/**
 * Isolated submission boundary for beta applications.
 * Currently not connected to any backend.
 */
export async function submitApplication(_application: BetaApplication): Promise<SubmitResult> {
  // TODO: Database call goes here later (persist the application, then return { ok: true }).
  return { ok: false, reason: "not_connected" };
}

const fields: { key: keyof BetaApplication; label: string; type?: string; multiline?: boolean }[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email", type: "email" },
  { key: "xHandle", label: "X handle" },
  { key: "idea", label: "What do you want to build", multiline: true },
];

export function BetaForm() {
  const [values, setValues] = useState<BetaApplication>({ name: "", email: "", xHandle: "", idea: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setNotice(null);
    const parsed = applicationSchema.safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof BetaApplication;
        if (!next[k]) next[k] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setPending(true);
    const result = await submitApplication(parsed.data);
    setPending(false);
    if (!result.ok) setNotice("Applications are not open yet. Check back soon.");
  }

  const inputClass =
    "mt-2 w-full border bg-surface px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-signal";

  return (
    <form onSubmit={onSubmit} noValidate className="panel flex flex-col gap-5 p-5 sm:p-6">
      {fields.map((f) => {
        const err = errors[f.key];
        const id = `beta-${f.key}`;
        return (
          <div key={f.key}>
            <label htmlFor={id} className="label-mono text-muted-foreground">
              {f.label}
            </label>
            {f.multiline ? (
              <textarea
                id={id}
                rows={5}
                value={values[f.key]}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                aria-invalid={!!err}
                className={cn(inputClass, "resize-y", err ? "border-destructive" : "border-border")}
              />
            ) : (
              <input
                id={id}
                type={f.type ?? "text"}
                value={values[f.key]}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                aria-invalid={!!err}
                className={cn(inputClass, err ? "border-destructive" : "border-border")}
              />
            )}
            {err && <p className="mt-1.5 text-xs text-destructive">{err}</p>}
          </div>
        );
      })}
      <button
        type="submit"
        disabled={pending}
        className="label-mono inline-flex w-fit items-center bg-signal px-6 py-3.5 text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        Submit application
      </button>
      {notice && (
        <p role="status" className="border border-border px-4 py-3 text-sm text-muted-foreground">
          {notice}
        </p>
      )}
    </form>
  );
}
