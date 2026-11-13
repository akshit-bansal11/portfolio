/*
 * RoadmapChecklist.tsx
 * The Docker and Kubernetes roadmaps from roadmap.sh, condensed into what to learn now
 * and what comes next, with links to where each topic is covered. `only` shows one
 * roadmap. Ticks are kept in this browser only (localStorage), as a personal progress
 * tracker: a bar fills as you tick, ticked topics get struck through, and finishing a
 * roadmap says so.
 */

"use client";

import { ArrowUpRight, Check, PartyPopper } from "lucide-react";
import { useSyncExternalStore } from "react";
import type { Tone } from "@/components/tutorials/Flow";
import { Logo, type Tech } from "@/components/tutorials/Logo";
import { cn } from "@/lib/utils";
import { motion } from "./ui";

interface Topic {
  label: string;
  /** Heading id on this page that covers it. */
  href?: string;
  later?: boolean;
}

const GROUPS: { tech: Tech; tone: Tone; title: string; topics: Topic[] }[] = [
  {
    tech: "docker",
    tone: "docker",
    title: "Docker roadmap",
    topics: [
      {
        label: "Bare metal vs VMs vs containers",
        href: "/tutorials/docker-vs-kubernetes-vs-vm#all-four-side-by-side",
      },
      { label: "Namespaces, cgroups, union filesystems", href: "#what-a-container-really-is" },
      { label: "Images and containers", href: "#image-vs-container" },
      { label: "Dockerfiles and efficient layer caching", href: "#layers-and-the-build-cache" },
      {
        label: "Image size and multi-stage builds",
        href: "#smaller-images-dockerignore-and-multi-stage",
      },
      {
        label: "Volumes, bind mounts, ephemeral filesystem",
        href: "#storage-volumes-and-bind-mounts",
      },
      { label: "Networks and port publishing", href: "#networks-and-ports" },
      { label: "Docker Compose", href: "#compose-registries-and-tags" },
      { label: "Registries and tagging", href: "#compose-registries-and-tags" },
      { label: "Image and runtime security", href: "#habits-worth-having-from-day-one" },
      { label: "Using third-party images (databases, CLIs)", href: "#build-and-run-hits" },
      { label: "Hot reloading, debuggers, tests in containers", later: true },
      { label: "Containers in CI pipelines", later: true },
      { label: "Deploying: PaaS, Kubernetes, Nomad", later: true },
    ],
  },
  {
    tech: "k8s",
    tone: "k8s",
    title: "Kubernetes roadmap",
    topics: [
      { label: "Why Kubernetes, key terms", href: "#why-kubernetes-exists" },
      { label: "Control plane and nodes", href: "#the-cluster-piece-by-piece" },
      { label: "Pods, ReplicaSets, Deployments", href: "#the-objects-that-matter" },
      { label: "Services and pod-to-pod networking", href: "#the-objects-that-matter" },
      { label: "ConfigMaps and Secrets", href: "#the-objects-that-matter" },
      { label: "Requests, limits, probes", href: "#the-objects-that-matter" },
      { label: "Rolling updates and rollbacks", href: "#rolling-blue-green-and-canary" },
      { label: "Blue-green and canary deployments", href: "#rolling-blue-green-and-canary" },
      { label: "Jobs, CronJobs, StatefulSets", href: "#more-objects-you-will-meet" },
      { label: "RBAC and network policies", href: "#more-objects-you-will-meet" },
      { label: "Installing a local cluster", href: "#build-the-cluster-and-deploy" },
      { label: "HPA, VPA, cluster autoscaling", later: true },
      { label: "Helm charts and GitOps", later: true },
      { label: "Monitoring, logs, metrics, traces", later: true },
      { label: "Taints, tolerations, topology spread", later: true },
      { label: "CRDs and custom controllers", later: true },
    ],
  },
];

const STORE = "tut-dkv-roadmap";
const listeners = new Set<() => void>();

// The raw stored string is the snapshot (stable between reads); storage may be blocked.
function read(): string {
  try {
    const raw = localStorage.getItem(STORE) ?? "[]";
    return Array.isArray(JSON.parse(raw)) ? raw : "[]";
  } catch {
    return "[]";
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function write(next: string[]) {
  try {
    localStorage.setItem(STORE, JSON.stringify(next));
  } catch {
    // Storage blocked: ticks just will not persist.
  }
  for (const listener of listeners) listener();
}

// One topic: a real checkbox styled as a tinted box, the label, and where it is covered.
function TopicRow({
  topic,
  id,
  done,
  onToggle,
}: {
  topic: Topic;
  id: string;
  done: boolean;
  onToggle: () => void;
}) {
  return (
    <li className="group flex min-h-10 items-center gap-3 rounded-lg px-2 transition-colors hover:bg-(--tone-soft)">
      <span className="relative flex h-5 w-5 shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={done}
          onChange={onToggle}
          className={cn(
            motion.press,
            "peer h-5 w-5 cursor-pointer appearance-none rounded-md border-[1.5px] border-(--tone-line) bg-paper transition-colors",
            "checked:border-(--tone) checked:bg-(--tone) group-hover:border-(--tone)",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--tone)",
          )}
        />
        <Check
          aria-hidden
          strokeWidth={3}
          className="pointer-events-none absolute inset-0.5 h-4 w-4 scale-50 text-paper opacity-0 transition-[opacity,transform] duration-200 peer-checked:scale-100 peer-checked:opacity-100"
        />
      </span>
      <label
        htmlFor={id}
        className={cn(
          "flex-1 cursor-pointer py-2 text-sm leading-snug transition-colors duration-300",
          "bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-[position:0_55%] bg-no-repeat motion-safe:transition-[background-size,color] motion-safe:duration-300",
          done ? "bg-[length:100%_1px] text-ink-muted" : "text-ink",
        )}
      >
        {topic.label}
      </label>
      {topic.href && (
        <a
          href={topic.href}
          className="flex shrink-0 items-center gap-0.5 rounded text-xs font-semibold text-(--tone) hover:underline focus-visible:outline-2 focus-visible:outline-(--tone)"
        >
          {topic.href.startsWith("#") ? "on this page" : "other tutorial"}
          <ArrowUpRight className="h-3 w-3" aria-hidden />
        </a>
      )}
    </li>
  );
}

export default function RoadmapChecklist({ only }: { only?: Tech }) {
  const raw = useSyncExternalStore(subscribe, read, () => "[]");
  const done: string[] = JSON.parse(raw);

  function toggle(key: string) {
    write(done.includes(key) ? done.filter((k) => k !== key) : [...done, key]);
  }

  return (
    <div data-widget="roadmap" className={cn("my-10 grid gap-4", !only && "lg:grid-cols-2")}>
      {GROUPS.filter((group) => !only || group.tech === only).map((group) => {
        const keyOf = (t: Topic) => `${group.tech}:${t.label}`;
        const count = group.topics.filter((t) => done.includes(keyOf(t))).length;
        const total = group.topics.length;
        const pct = Math.round((count / total) * 100);
        const parts = [
          { title: "Learn now", topics: group.topics.filter((t) => !t.later) },
          { title: "Learn next", topics: group.topics.filter((t) => t.later) },
        ];
        return (
          <section
            key={group.tech}
            data-tone={group.tone}
            aria-label={group.title}
            className="rounded-2xl border border-rule bg-paper-raised p-4 sm:p-5"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-2 text-lg font-bold text-ink">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-(--tone-soft)">
                  <Logo tech={group.tech} />
                </span>
                {group.title}
              </p>
              {count === total ? (
                <span
                  key="all"
                  data-tone="green"
                  className="tut-pop flex items-center gap-1 rounded-full border border-(--tone-line) bg-(--tone-soft) px-2 py-0.5 text-xs font-semibold text-(--tone)"
                >
                  <PartyPopper className="h-3.5 w-3.5" aria-hidden /> All done
                </span>
              ) : (
                <span aria-live="polite" className="font-mono text-sm text-ink-muted">
                  {count}/{total}
                </span>
              )}
            </div>
            <div
              role="progressbar"
              aria-label={`${group.title} progress`}
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={count}
              className="mt-3 h-1.5 overflow-hidden rounded-full bg-rule"
            >
              <div
                className="h-full rounded-full bg-(--tone) motion-safe:transition-[width] motion-safe:duration-500 motion-safe:ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>

            {parts.map((part) => (
              <div key={part.title} className="mt-4">
                <p className="mb-1 px-2 text-xs font-bold tracking-[0.08em] text-ink-muted uppercase">
                  {part.title}
                </p>
                <ul className="list-none space-y-0.5 p-0">
                  {part.topics.map((topic) => (
                    <TopicRow
                      key={keyOf(topic)}
                      id={keyOf(topic)}
                      topic={topic}
                      done={done.includes(keyOf(topic))}
                      onToggle={() => toggle(keyOf(topic))}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );
}
