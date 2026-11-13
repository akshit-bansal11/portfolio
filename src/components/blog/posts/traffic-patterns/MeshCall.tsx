/*
 * MeshCall.tsx
 * One call through a service mesh, step by step. A control plane configures two
 * sidecars; Orders calls localhost; its sidecar finds and picks a Payments copy; the
 * sidecars connect over mutual TLS; the Payments sidecar checks the policy and hands the
 * call over; both record metrics. The scene plays on a loop (paused on hover or focus,
 * and never auto-played under reduced motion) and can be stepped by hand. The lit part
 * of each step carries flowing packets; job chips pop onto the sidecars. Plain HTML, so
 * it reflows: side by side from `md` up, a U-shape on phones. The printed copy lists
 * every step.
 */

"use client";

import {
  ChevronLeft,
  ChevronRight,
  Cpu,
  Lock,
  Pause,
  Play,
  ShoppingCart,
  Wallet,
} from "lucide-react";
import { type CSSProperties, type ReactNode, useEffect, useState } from "react";
import { Wire } from "@/components/tutorials/Diagram";
import { cn } from "@/lib/utils";

type Part = "cp" | "cfg" | "orders" | "localA" | "sideA" | "mtls" | "sideB" | "localB" | "payments";

interface Step {
  title: string;
  note: string;
  lit: Part[];
  chipsA?: string[];
  chipsB?: string[];
}

const STEPS: Step[] = [
  {
    title: "Configure",
    note: "The control plane hands every sidecar its routing rules, security policies and certificates.",
    lit: ["cp", "cfg", "sideA", "sideB"],
    chipsA: ["rules", "certificate"],
    chipsB: ["policy", "certificate"],
  },
  {
    title: "Plain call",
    note: "Orders makes a plain, simple call to localhost. It doesn't know where Payments runs.",
    lit: ["orders", "localA"],
  },
  {
    title: "Find + pick",
    note: "Its sidecar does the network work: it finds the healthy copies of Payments (discovery), picks one (load balancing), and applies the timeout and retries.",
    lit: ["sideA"],
    chipsA: ["discovery", "load balancing", "timeout + retries"],
  },
  {
    title: "mTLS",
    note: "The two sidecars connect with mutual TLS. Both show a certificate, so each knows who the other is, and the call is encrypted.",
    lit: ["sideA", "mtls", "sideB"],
    chipsA: ["certificate"],
    chipsB: ["certificate"],
  },
  {
    title: "Check policy",
    note: "The Payments sidecar checks the rules: is Orders allowed to call Payments? Yes, so the call goes through.",
    lit: ["sideB"],
    chipsB: ["policy: allow Orders"],
  },
  {
    title: "Deliver",
    note: "Payments gets a plain local call. Both sidecars record how long it took, so the call shows up in metrics and traces.",
    lit: ["sideA", "sideB", "localB", "payments"],
    chipsA: ["metrics"],
    chipsB: ["metrics"],
  },
];

function Box({
  tone,
  lit,
  dim,
  icon,
  title,
  note,
  chips,
  className,
}: {
  tone: "blue" | "green" | "violet" | "pink";
  lit: boolean;
  dim: boolean;
  icon: ReactNode;
  title: string;
  note?: string;
  chips?: string[];
  className?: string;
}) {
  return (
    <div
      data-tone={tone}
      className={cn(
        "dg-node min-w-0 rounded-xl border px-2.5 py-2 transition-[opacity,background-color,border-color] duration-300 sm:px-3",
        lit ? "border-(--tone) bg-(--tone-soft)" : "border-(--tone-line) bg-paper",
        dim && "opacity-55",
        className,
      )}
    >
      <p className="flex items-center gap-2">
        <span className="dg-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--tone-soft) text-(--tone) [&_svg]:h-[18px] [&_svg]:w-[18px]">
          {icon}
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block text-sm font-semibold text-ink">{title}</span>
          {note && <span className="block text-xs text-ink-muted">{note}</span>}
        </span>
      </p>
      {chips && chips.length > 0 && (
        <ul className="mt-2 flex list-none flex-wrap gap-1 p-0">
          {chips.map((chip, i) => (
            <li
              key={chip}
              className="tut-pop rounded-md border border-(--tone-line) bg-paper px-1.5 py-0.5 font-mono text-[0.7rem] text-(--tone)"
              style={{ "--delay": `${i * 0.12}s` } as CSSProperties}
            >
              {chip}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// A connector: packets flow only while it is lit. `reverseOnPhone` flips the flow when
// the phone layout mirrors the pod.
function Pipe({
  axis,
  lit,
  tone,
  className,
  reverseOnPhone,
}: {
  axis: "x" | "y";
  lit: boolean;
  tone: string;
  className?: string;
  reverseOnPhone?: boolean;
}) {
  const size = axis === "x" ? "w-full" : "h-full min-h-8";
  return (
    <span
      data-tone={tone}
      className={cn(
        "dg-link flex items-center justify-center transition-opacity duration-300",
        !lit && "opacity-40",
        reverseOnPhone && "max-md:[&_.dg-dot]:[animation-direction:reverse]",
        className,
      )}
    >
      {lit ? (
        <Wire axis={axis} className={size} />
      ) : (
        <span
          className={cn(
            "block rounded-full bg-(--tone-line)",
            axis === "x" ? "h-[2px] w-full" : "h-full min-h-8 w-[2px]",
          )}
        />
      )}
    </span>
  );
}

export default function MeshCall() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [held, setHeld] = useState(false);
  const current = STEPS[step];
  const lit = (part: Part) => current.lit.includes(part);
  const dim = (part: Part) => !lit(part);

  // Auto-play only when motion is welcome.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) setPlaying(true);
  }, []);

  useEffect(() => {
    if (!playing || held) return;
    const timer = window.setTimeout(() => setStep((s) => (s + 1) % STEPS.length), 2600);
    return () => window.clearTimeout(timer);
  }, [playing, held, step]);

  const go = (next: number) => {
    setPlaying(false);
    setStep((next + STEPS.length) % STEPS.length);
  };

  return (
    // Hover or focus inside pauses the loop so the reader can read.
    <div
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      <div
        role="img"
        aria-label="A service mesh. A control plane at the top configures two sidecars. On the left, the Orders service sits next to its sidecar in one pod. On the right, the Payments service sits next to its sidecar. Each service only talks to its own sidecar on localhost; the two sidecars talk to each other over mutual TLS."
      >
        {/* Control plane */}
        <div className="flex justify-center">
          <Box
            tone="violet"
            lit={lit("cp")}
            dim={dim("cp")}
            icon={<Cpu />}
            title="Control plane"
            note="the central brain"
            className="w-full max-w-xs"
          />
        </div>

        {/* Config lines: one centred wire on phones, one per sidecar from md up. */}
        <div className="h-10">
          <div className="flex h-full justify-center md:hidden">
            <Pipe axis="y" lit={lit("cfg")} tone="violet" className="h-full" />
          </div>
          <div className="hidden h-full md:grid md:grid-cols-[1fr_4rem_1fr]">
            <div className="grid grid-cols-[1fr_1.5rem_1fr] px-3">
              <span />
              <span />
              <Pipe axis="y" lit={lit("cfg")} tone="violet" className="h-full" />
            </div>
            <span />
            <div className="grid grid-cols-[1fr_1.5rem_1fr] px-3">
              <Pipe axis="y" lit={lit("cfg")} tone="violet" className="h-full" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 items-stretch md:grid-cols-[1fr_4rem_1fr]">
          {/* Pod A: Orders + its sidecar (sidecar on the inner side). */}
          <section
            data-tone="blue"
            className="rounded-2xl border border-dashed border-(--tone-line) bg-(--tone-soft) p-2.5 sm:p-3"
          >
            <p className="mb-2 text-xs font-bold tracking-[0.08em] text-(--tone) uppercase">
              Pod: Orders
            </p>
            <div className="grid grid-cols-[1fr_1.5rem_1fr] items-center">
              <Box
                tone="blue"
                lit={lit("orders")}
                dim={dim("orders")}
                icon={<ShoppingCart />}
                title="Orders"
                note="your code"
              />
              <Pipe axis="x" lit={lit("localA")} tone="blue" />
              <Box
                tone="green"
                lit={lit("sideA")}
                dim={dim("sideA")}
                icon={<Lock />}
                title="Sidecar"
                note="proxy"
                chips={current.chipsA}
              />
            </div>
          </section>

          {/* Sidecar to sidecar: down on phones (under the sidecars), across from md up. */}
          <div className="grid grid-cols-[1fr_1.5rem_1fr] px-2.5 md:flex md:items-center md:px-0">
            <span className="md:hidden" />
            <span className="md:hidden" />
            <div className="flex h-12 flex-col items-center justify-center md:h-auto md:w-full">
              <span
                data-tone="green"
                className={cn(
                  "text-[0.7rem] font-bold tracking-wide text-(--tone) uppercase transition-opacity duration-300 max-md:hidden",
                  !lit("mtls") && "opacity-50",
                )}
              >
                mTLS
              </span>
              <Pipe axis="x" lit={lit("mtls")} tone="green" className="w-full max-md:hidden" />
              <Pipe axis="y" lit={lit("mtls")} tone="green" className="h-full md:hidden" />
            </div>
          </div>

          {/* Pod B: Payments + its sidecar. Sidecar on the inner side from md up, under
              Pod A's sidecar on phones. */}
          <section
            data-tone="pink"
            className="rounded-2xl border border-dashed border-(--tone-line) bg-(--tone-soft) p-2.5 sm:p-3"
          >
            <p className="mb-2 text-xs font-bold tracking-[0.08em] text-(--tone) uppercase">
              Pod: Payments
            </p>
            <div className="grid grid-cols-[1fr_1.5rem_1fr] items-center">
              <Box
                tone="green"
                lit={lit("sideB")}
                dim={dim("sideB")}
                icon={<Lock />}
                title="Sidecar"
                note="proxy"
                chips={current.chipsB}
                className="order-3 md:order-1"
              />
              <Pipe axis="x" lit={lit("localB")} tone="pink" className="order-2" reverseOnPhone />
              <Box
                tone="pink"
                lit={lit("payments")}
                dim={dim("payments")}
                icon={<Wallet />}
                title="Payments"
                note="your code"
                className="order-1 md:order-3"
              />
            </div>
          </section>
        </div>
      </div>

      {/* Step picker */}
      <ol className="mt-5 grid list-none grid-cols-3 gap-1.5 p-0 sm:grid-cols-6 print:hidden">
        {STEPS.map((s, i) => (
          <li key={s.title}>
            <button
              type="button"
              data-tone="violet"
              aria-current={i === step ? "step" : undefined}
              onClick={() => go(i)}
              className={cn(
                "flex min-h-10 w-full items-center gap-1.5 rounded-lg border px-2 text-left text-xs font-semibold transition-colors active:translate-y-px sm:text-sm",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--tone)",
                i === step
                  ? "border-(--tone) bg-(--tone-soft) text-(--tone)"
                  : "border-rule text-ink-muted hover:border-(--tone-line) hover:text-ink",
              )}
            >
              <span className="font-mono">{i + 1}</span>
              {s.title}
            </button>
          </li>
        ))}
      </ol>

      <p aria-live="polite" className="mt-3 min-h-12 text-ink print:hidden">
        <b>
          Step {step + 1}/{STEPS.length}:
        </b>{" "}
        {current.note}
      </p>

      <ol className="mt-3 hidden list-decimal space-y-1 pl-5 text-sm text-ink print:block">
        {STEPS.map((s) => (
          <li key={s.title}>{s.note}</li>
        ))}
      </ol>

      <div className="mt-2 flex flex-wrap items-center gap-2 print:hidden">
        <button
          type="button"
          onClick={() => go(step - 1)}
          className="inline-flex min-h-10 items-center rounded-md border border-rule px-3 text-sm text-ink active:translate-y-px"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden /> Back
        </button>
        <button
          type="button"
          data-tone="violet"
          onClick={() => setPlaying(!playing)}
          className="inline-flex min-h-10 items-center gap-1 rounded-md bg-(--tone) px-3 text-sm font-semibold text-paper active:translate-y-px"
        >
          {playing ? (
            <Pause className="h-4 w-4" aria-hidden />
          ) : (
            <Play className="h-4 w-4" aria-hidden />
          )}
          {playing ? "Pause" : "Play"}
        </button>
        <button
          type="button"
          onClick={() => go(step + 1)}
          className="inline-flex min-h-10 items-center rounded-md border border-rule px-3 text-sm text-ink active:translate-y-px"
        >
          Next <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
