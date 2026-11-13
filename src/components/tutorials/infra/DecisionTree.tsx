/*
 * DecisionTree.tsx
 * "VM, Docker or Kubernetes?" as a yes/no walk. A rail of the four questions fills in as
 * you answer, and the four possible outcomes below narrow as each answer rules some out;
 * hovering Yes or No previews which outcomes that answer keeps. Each walk ends at one
 * honest recommendation. The printed copy is the whole tree as nested text.
 */

"use client";

import { Cloud, Flag, RotateCcw, Undo2 } from "lucide-react";
import { type CSSProperties, type ReactNode, useState } from "react";
import type { Tone } from "@/components/tutorials/Flow";
import { Logo, type Tech } from "@/components/tutorials/Logo";
import { cn } from "@/lib/utils";
import { BUTTON, FRAME, motion, PRIMARY } from "./ui";

type QuestionId = "os" | "size" | "people" | "needs";
type AnswerId = "vm" | "compose" | "managed" | "k8s";
type NodeId = QuestionId | AnswerId;
type Said = "Yes" | "No";

interface Question {
  kind: "q";
  text: string;
  /** A few words for the rail. */
  short: string;
  yes: NodeId;
  no: NodeId;
}

interface Answer {
  kind: "a";
  title: string;
  /** A few words for the outcome chip. */
  short: string;
  text: string;
  tone: Tone;
  tech?: Tech;
}

const TREE: Record<NodeId, Question | Answer> = {
  os: {
    kind: "q",
    text: "Do you need a different OS or kernel, or a hard security wall (untrusted code, strict compliance)?",
    short: "Other OS or hard wall?",
    yes: "vm",
    no: "size",
  },
  size: {
    kind: "q",
    text: "Is it one app or a handful of services that fit on one machine?",
    short: "Fits one machine?",
    yes: "compose",
    no: "people",
  },
  people: {
    kind: "q",
    text: "Is there someone to run a cluster, or a managed one (EKS, GKE, AKS) your company already pays for?",
    short: "Someone to run it?",
    yes: "needs",
    no: "managed",
  },
  needs: {
    kind: "q",
    text: "Do you need self-healing, rolling updates and autoscaling across many machines?",
    short: "Self-heal at scale?",
    yes: "k8s",
    no: "managed",
  },
  vm: {
    kind: "a",
    title: "Use a virtual machine",
    short: "Virtual machine",
    text: "A cloud VM or a local one. You can still run Docker inside it, which is what most servers do.",
    tone: "vm",
    tech: "vm",
  },
  compose: {
    kind: "a",
    title: "Use Docker + Compose",
    short: "Docker + Compose",
    text: "One compose.yaml, one server. Simple, cheap and honest. Most side projects never need more.",
    tone: "docker",
    tech: "docker",
  },
  managed: {
    kind: "a",
    title: "Use a managed container service",
    short: "Managed service",
    text: "Cloud Run, AWS ECS/Fargate or Azure Container Apps run your image and scale it without you running nodes.",
    tone: "cyan",
  },
  k8s: {
    kind: "a",
    title: "Use Kubernetes",
    short: "Kubernetes",
    text: "Ideally a managed cluster. Containers are still the unit; Kubernetes keeps them alive and rolls them out.",
    tone: "k8s",
    tech: "k8s",
  },
};

const QUESTIONS: QuestionId[] = ["os", "size", "people", "needs"];
const ANSWERS: AnswerId[] = ["vm", "compose", "managed", "k8s"];

// Every outcome still reachable from a node.
function reachable(id: NodeId): Set<NodeId> {
  const node = TREE[id];
  if (node.kind === "a") return new Set([id]);
  return new Set([...reachable(node.yes), ...reachable(node.no)]);
}

function icon(answer: Answer): ReactNode {
  return answer.tech ? <Logo tech={answer.tech} /> : <Cloud className="h-5 w-5" aria-hidden />;
}

function PrintTree({ id, depth = 0 }: { id: NodeId; depth?: number }) {
  const node = TREE[id];
  if (node.kind === "a") return <li style={{ marginLeft: depth * 16 }}>→ {node.title}</li>;
  return (
    <>
      <li style={{ marginLeft: depth * 16 }}>{node.text}</li>
      <li style={{ marginLeft: (depth + 1) * 16 }}>Yes:</li>
      <PrintTree id={node.yes} depth={depth + 2} />
      <li style={{ marginLeft: (depth + 1) * 16 }}>No:</li>
      <PrintTree id={node.no} depth={depth + 2} />
    </>
  );
}

export default function DecisionTree() {
  const [path, setPath] = useState<{ id: NodeId; said?: Said }[]>([{ id: "os" }]);
  const [hover, setHover] = useState<Said | null>(null);
  const here = path[path.length - 1].id;
  const current = TREE[here];
  const open = reachable(here);
  const kept =
    current.kind === "q" && hover ? reachable(hover === "Yes" ? current.yes : current.no) : null;
  const asked = path.filter((step) => step.said);
  const progress = current.kind === "a" ? 100 : (QUESTIONS.indexOf(here as QuestionId) / 4) * 100;

  function answer(said: Said) {
    if (current.kind !== "q") return;
    setHover(null);
    setPath((p) => [
      ...p.slice(0, -1),
      { ...p[p.length - 1], said },
      { id: said === "Yes" ? current.yes : current.no },
    ]);
  }

  function back() {
    setHover(null);
    setPath((p) => (p.length > 1 ? [...p.slice(0, -2), { id: p[p.length - 2].id }] : p));
  }

  return (
    <div data-widget="decision-tree" data-tone="k8s" className={FRAME}>
      <div className="print:hidden">
        <p aria-live="polite" className="sr-only">
          {current.kind === "q" ? current.text : `${current.title}. ${current.text}`}
        </p>
        {/* The rail: one stop per question, filling as you go. */}
        <ol
          aria-label="Questions"
          className="relative grid list-none grid-cols-5 gap-1 p-0 text-center"
        >
          <span
            aria-hidden
            className="absolute top-5 right-[10%] left-[10%] h-[2px] -translate-y-1/2 rounded-full bg-rule"
          />
          <span
            aria-hidden
            className="absolute top-5 left-[10%] h-[2px] -translate-y-1/2 rounded-full bg-(--tone) motion-safe:transition-[width] motion-safe:duration-700 motion-safe:ease-out"
            style={{ width: `${progress * 0.8}%` }}
          />
          {QUESTIONS.map((id, i) => {
            const step = path.find((s) => s.id === id);
            const now = here === id;
            const tone: Tone = step?.said ? (step.said === "Yes" ? "green" : "pink") : "k8s";
            return (
              <li
                key={id}
                data-tone={tone}
                aria-current={now ? "step" : undefined}
                className="relative flex flex-col items-center gap-1"
              >
                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border font-mono text-sm font-bold transition-colors duration-300",
                    step?.said && "border-(--tone) bg-paper text-(--tone)",
                    now && "dg-pulse border-(--tone) bg-(--tone-soft) text-(--tone)",
                    !step && "border-dashed border-rule bg-paper text-ink-muted",
                  )}
                >
                  {step?.said ? (
                    <span key={step.said} className="tut-pop text-xs">
                      {step.said}
                    </span>
                  ) : (
                    i + 1
                  )}
                </span>
                <span
                  className={cn(
                    "text-[0.7rem] leading-tight sm:text-xs",
                    now ? "font-semibold text-ink" : "text-ink-muted",
                    !step && !now && "opacity-60",
                  )}
                >
                  {TREE[id].kind === "q" && (TREE[id] as Question).short}
                </span>
              </li>
            );
          })}
          <li
            data-tone={current.kind === "a" ? current.tone : "k8s"}
            className="relative flex flex-col items-center gap-1"
          >
            <span
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300",
                current.kind === "a"
                  ? "border-(--tone) bg-(--tone-soft) text-(--tone)"
                  : "border-dashed border-rule bg-paper text-ink-muted",
              )}
            >
              <Flag className="h-4 w-4" aria-hidden />
            </span>
            <span className="text-[0.7rem] leading-tight text-ink-muted sm:text-xs">Answer</span>
          </li>
        </ol>

        {/* The outcomes: each answer rules some out. */}
        <ul
          aria-label="Possible outcomes"
          className="mt-5 grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-4"
        >
          {ANSWERS.map((id) => {
            const a = TREE[id] as Answer;
            const chosen = here === id;
            const out = !open.has(id);
            const previewed = kept?.has(id);
            return (
              <li
                key={id}
                data-tone={a.tone}
                className={cn(
                  "flex min-h-12 items-center gap-2 rounded-xl border bg-paper px-3 py-2 text-sm font-semibold transition-[opacity,border-color,background-color,transform] duration-300",
                  chosen && "dg-pulse border-(--tone) bg-(--tone-soft) text-(--tone)",
                  !chosen && !out && "border-(--tone-line) text-ink",
                  out && "border-rule text-ink-muted opacity-40",
                  kept && !previewed && !out && "opacity-40",
                  previewed &&
                    !chosen &&
                    "-translate-y-0.5 border-dashed border-(--tone) bg-(--tone-soft)",
                )}
              >
                <span className="flex shrink-0 text-(--tone)">{icon(a)}</span>
                <span className={cn("min-w-0 leading-tight", out && "line-through")}>
                  {a.short}
                </span>
              </li>
            );
          })}
        </ul>

        {current.kind === "q" ? (
          <div key={here} className={cn(motion["slide-in"], "mt-5")}>
            <p className="font-mono text-xs font-bold text-(--tone)">
              Question {QUESTIONS.indexOf(here as QuestionId) + 1} of 4
            </p>
            <p className="mt-1 text-lg font-semibold text-ink">{current.text}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {(["Yes", "No"] as const).map((said) => (
                <button
                  key={said}
                  type="button"
                  data-tone={said === "Yes" ? "green" : "pink"}
                  onClick={() => answer(said)}
                  onMouseEnter={() => setHover(said)}
                  onMouseLeave={() => setHover((h) => (h === said ? null : h))}
                  onFocus={() => setHover(said)}
                  onBlur={() => setHover((h) => (h === said ? null : h))}
                  className={cn(PRIMARY, "min-h-11 min-w-24 px-6 text-base")}
                >
                  {said}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div
            key={here}
            data-tone={current.tone}
            className={cn(
              "tut-pop mt-5 rounded-xl border-[1.5px] border-(--tone) bg-(image:--tone-fill) p-4",
            )}
            style={{ "--delay": "0.15s" } as CSSProperties}
          >
            <p className="flex items-center gap-2 text-xl font-bold text-(--tone)">
              {icon(current)}
              {current.title}
            </p>
            <p className="mt-1 text-ink">{current.text}</p>
          </div>
        )}

        {asked.length > 0 && (
          <ol
            aria-label="Your answers"
            className="mt-4 flex list-none flex-wrap gap-1.5 p-0 text-xs"
          >
            {asked.map((step, i) => (
              <li
                key={step.id}
                data-tone={step.said === "Yes" ? "green" : "pink"}
                className="rounded-full border border-(--tone-line) bg-paper px-2 py-0.5 text-ink-muted"
              >
                {i + 1}. {(TREE[step.id] as Question).short}{" "}
                <b className="text-(--tone)">{step.said}</b>
              </li>
            ))}
          </ol>
        )}

        <div className={cn("mt-4 flex flex-wrap gap-2", path.length === 1 && "invisible")}>
          <button type="button" onClick={back} className={BUTTON}>
            <Undo2 className="h-4 w-4" aria-hidden /> Back one
          </button>
          <button
            type="button"
            onClick={() => {
              setHover(null);
              setPath([{ id: "os" }]);
            }}
            className={cn(BUTTON, "border-transparent bg-transparent text-ink-muted")}
          >
            <RotateCcw className="h-4 w-4" aria-hidden /> Start again
          </button>
        </div>
      </div>
      <ul className="hidden list-none p-0 text-sm text-ink print:block">
        <PrintTree id="os" />
      </ul>
    </div>
  );
}
