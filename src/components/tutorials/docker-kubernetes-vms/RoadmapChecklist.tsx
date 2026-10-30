/*
 * RoadmapChecklist.tsx
 * The Docker and Kubernetes roadmaps from roadmap.sh, condensed into what to learn now
 * and what comes next, with links to where this page covers each topic. Ticks are kept
 * in this browser only (localStorage), as a personal progress tracker.
 */

"use client";

import { useSyncExternalStore } from "react";
import { Logo, type Tech } from "@/components/tutorials/Logo";
import { cn } from "@/lib/utils";

interface Topic {
  label: string;
  /** Heading id on this page that covers it. */
  href?: string;
  later?: boolean;
}

const GROUPS: { tech: Tech; title: string; topics: Topic[] }[] = [
  {
    tech: "docker",
    title: "Docker roadmap",
    topics: [
      { label: "Bare metal vs VMs vs containers", href: "#comparing-the-two" },
      { label: "Namespaces, cgroups, union filesystems", href: "#under-the-hood" },
      { label: "Images and containers", href: "#docker-essentials" },
      { label: "Dockerfiles and efficient layer caching", href: "#layers-and-the-build-cache" },
      { label: "Image size and multi-stage builds", href: "#multi-stage-builds" },
      {
        label: "Volumes, bind mounts, ephemeral filesystem",
        href: "#storage-volumes-and-bind-mounts",
      },
      { label: "Networks and port publishing", href: "#networks-and-names" },
      { label: "Docker Compose", href: "#compose-several-containers-one-file" },
      { label: "Registries and tagging", href: "#registries-and-tags" },
      { label: "Image and runtime security", href: "#habits-worth-having-from-day-one" },
      { label: "Using third-party images (databases, CLIs)", href: "#part-2-docker" },
      { label: "Hot reloading, debuggers, tests in containers", later: true },
      { label: "Containers in CI pipelines", later: true },
      { label: "Deploying: PaaS, Kubernetes, Nomad", later: true },
    ],
  },
  {
    tech: "k8s",
    title: "Kubernetes roadmap",
    topics: [
      { label: "Why Kubernetes, key terms", href: "#kubernetes-essentials" },
      { label: "Control plane and nodes", href: "#the-cluster-piece-by-piece" },
      { label: "Pods, ReplicaSets, Deployments", href: "#the-objects-that-matter" },
      { label: "Services and pod-to-pod networking", href: "#the-objects-that-matter" },
      { label: "ConfigMaps and Secrets", href: "#the-objects-that-matter" },
      { label: "Requests, limits, probes", href: "#the-objects-that-matter" },
      { label: "Rolling updates and rollbacks", href: "#rolling-blue-green-and-canary" },
      { label: "Blue-green and canary deployments", href: "#rolling-blue-green-and-canary" },
      { label: "Jobs, CronJobs, StatefulSets", href: "#more-objects-you-will-meet" },
      { label: "RBAC and network policies", href: "#more-objects-you-will-meet" },
      { label: "Installing a local cluster", href: "#part-3-kubernetes-on-kind" },
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

export default function RoadmapChecklist() {
  const raw = useSyncExternalStore(subscribe, read, () => "[]");
  const done: string[] = JSON.parse(raw);

  function toggle(key: string) {
    write(done.includes(key) ? done.filter((k) => k !== key) : [...done, key]);
  }

  return (
    <div className="my-8 grid gap-4 lg:grid-cols-2">
      {GROUPS.map((group) => {
        const count = group.topics.filter((t) => done.includes(`${group.tech}:${t.label}`)).length;
        return (
          <section key={group.tech} className="rounded-2xl border border-rule bg-paper-raised p-4">
            <p className="flex items-center justify-between gap-2 text-lg font-bold text-ink">
              <span className="flex items-center gap-2">
                <Logo tech={group.tech} /> {group.title}
              </span>
              <span className="text-sm font-normal text-ink-muted">
                {count}/{group.topics.length}
              </span>
            </p>
            <ul className="mt-3 list-none space-y-1 p-0">
              {group.topics.map((topic) => {
                const key = `${group.tech}:${topic.label}`;
                return (
                  <li key={key} className="flex items-center gap-2 text-sm">
                    <input
                      id={key}
                      type="checkbox"
                      checked={done.includes(key)}
                      onChange={() => toggle(key)}
                      className="h-4 w-4 accent-(--tut-green)"
                    />
                    <label
                      htmlFor={key}
                      className={cn(
                        "text-ink",
                        done.includes(key) && "text-ink-muted line-through",
                      )}
                    >
                      {topic.label}
                    </label>
                    {topic.href ? (
                      <a
                        href={topic.href}
                        data-tone="green"
                        className="ml-auto shrink-0 text-xs font-semibold text-(--tone) hover:underline"
                      >
                        on this page
                      </a>
                    ) : (
                      <span
                        data-tone="amber"
                        className="ml-auto shrink-0 rounded-full bg-(--tone-soft) px-2 text-xs font-semibold text-(--tone)"
                      >
                        learn next
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
