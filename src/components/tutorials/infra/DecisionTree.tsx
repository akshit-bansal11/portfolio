/*
 * DecisionTree.tsx
 * "VM, Docker or Kubernetes?" as a yes/no walk. Each answer narrows to one honest
 * recommendation, with the path so far shown as breadcrumbs. The printed copy is the
 * whole tree as nested text.
 */

"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";
import type { Tone } from "@/components/tutorials/Flow";
import { Logo, type Tech } from "@/components/tutorials/Logo";
import { cn } from "@/lib/utils";

type NodeId = "os" | "size" | "people" | "needs" | "vm" | "compose" | "managed" | "k8s";

interface Question {
  kind: "q";
  text: string;
  yes: NodeId;
  no: NodeId;
}

interface Answer {
  kind: "a";
  title: string;
  text: string;
  tone: Tone;
  tech?: Tech;
}

const TREE: Record<NodeId, Question | Answer> = {
  os: {
    kind: "q",
    text: "Do you need a different OS or kernel, or a hard security wall (untrusted code, strict compliance)?",
    yes: "vm",
    no: "size",
  },
  size: {
    kind: "q",
    text: "Is it one app or a handful of services that fit on one machine?",
    yes: "compose",
    no: "people",
  },
  people: {
    kind: "q",
    text: "Is there someone to run a cluster, or a managed one (EKS, GKE, AKS) your company already pays for?",
    yes: "needs",
    no: "managed",
  },
  needs: {
    kind: "q",
    text: "Do you need self-healing, rolling updates and autoscaling across many machines?",
    yes: "k8s",
    no: "managed",
  },
  vm: {
    kind: "a",
    title: "Use a virtual machine",
    text: "A cloud VM or a local one. You can still run Docker inside it, which is what most servers do.",
    tone: "vm",
    tech: "vm",
  },
  compose: {
    kind: "a",
    title: "Use Docker + Compose",
    text: "One compose.yaml, one server. Simple, cheap and honest. Most side projects never need more.",
    tone: "docker",
    tech: "docker",
  },
  managed: {
    kind: "a",
    title: "Use a managed container service",
    text: "Cloud Run, AWS ECS/Fargate or Azure Container Apps run your image and scale it without you running nodes.",
    tone: "cyan",
  },
  k8s: {
    kind: "a",
    title: "Use Kubernetes",
    text: "Ideally a managed cluster. Containers are still the unit; Kubernetes keeps them alive and rolls them out.",
    tone: "k8s",
    tech: "k8s",
  },
};

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
  const [path, setPath] = useState<{ id: NodeId; said?: "Yes" | "No" }[]>([{ id: "os" }]);
  const current = TREE[path[path.length - 1].id];

  function answer(said: "Yes" | "No") {
    if (current.kind !== "q") return;
    setPath((p) => [
      ...p.slice(0, -1),
      { ...p[p.length - 1], said },
      { id: said === "Yes" ? current.yes : current.no },
    ]);
  }

  return (
    <div className="my-8 rounded-2xl border border-rule bg-paper-raised p-5">
      <div className="print:hidden">
        <ol className="flex list-none flex-wrap gap-2 p-0 text-xs text-ink-muted">
          {path
            .filter((step) => step.said)
            .map((step, i) => {
              const q = TREE[step.id] as Question;
              return (
                <li key={step.id} className="rounded-full border border-rule px-2 py-0.5">
                  {i + 1}. {q.text.split("?")[0].slice(0, 42)}…{" "}
                  <b className="text-ink">{step.said}</b>
                </li>
              );
            })}
        </ol>

        {current.kind === "q" ? (
          <div className="mt-4">
            <p className="text-lg font-semibold text-ink">{current.text}</p>
            <div className="mt-4 flex gap-3">
              {(["Yes", "No"] as const).map((said) => (
                <button
                  key={said}
                  type="button"
                  data-tone={said === "Yes" ? "green" : "pink"}
                  onClick={() => answer(said)}
                  className="tut-glow rounded-lg border-2 border-(--tone) bg-(--tone-soft) px-6 py-2 font-semibold text-(--tone) transition hover:bg-(--tone) hover:text-paper"
                >
                  {said}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div
            data-tone={current.tone}
            aria-live="polite"
            className="tut-glow mt-4 rounded-xl border-2 border-(--tone) bg-(image:--tone-fill) p-4"
          >
            <p className="flex items-center gap-2 text-xl font-bold text-(--tone)">
              {current.tech && <Logo tech={current.tech} />}
              {current.title}
            </p>
            <p className="mt-1 text-ink">{current.text}</p>
          </div>
        )}

        <button
          type="button"
          onClick={() => setPath([{ id: "os" }])}
          className={cn(
            "mt-4 inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink",
            path.length === 1 && "invisible",
          )}
        >
          <RotateCcw className="h-4 w-4" aria-hidden /> Start again
        </button>
      </div>
      <ul className="hidden list-none p-0 text-sm text-ink print:block">
        <PrintTree id="os" />
      </ul>
    </div>
  );
}
