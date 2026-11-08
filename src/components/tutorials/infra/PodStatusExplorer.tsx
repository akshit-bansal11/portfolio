/*
 * PodStatusExplorer.tsx
 * The pod statuses you will actually see in `kubectl get pods`, as clickable chips.
 * Each one says what it means in plain words, the usual causes, and the commands that
 * find the real cause. The printed copy lists every status.
 */

"use client";

import { useState } from "react";
import type { Tone } from "@/components/tutorials/Flow";
import { cn } from "@/lib/utils";

interface Status {
  name: string;
  tone: Tone;
  means: string;
  causes: string[];
  check: string[];
}

const STATUSES: Status[] = [
  {
    name: "Pending",
    tone: "amber",
    means: "Accepted, but no node has agreed to run it yet.",
    causes: [
      "No node has enough free CPU or memory for its requests",
      "A PVC it needs is not bound",
      "Taints, node selectors or affinity rule out every node",
    ],
    check: [
      "kubectl describe pod POD   # read Events at the bottom",
      "kubectl get nodes",
      "kubectl describe nodes | grep -A5 Allocated",
    ],
  },
  {
    name: "ContainerCreating",
    tone: "cyan",
    means:
      "A node took it and is pulling the image and mounting volumes. Normal for a few seconds.",
    causes: [
      "A big image still downloading",
      "A volume, ConfigMap or Secret it mounts does not exist",
    ],
    check: ["kubectl describe pod POD", "kubectl get events --sort-by=.lastTimestamp"],
  },
  {
    name: "ImagePullBackOff",
    tone: "pink",
    means:
      "The node cannot get the image and is waiting longer between each retry. ErrImagePull is the same problem, earlier.",
    causes: [
      "Typo in the image name or tag",
      "Private registry and no imagePullSecret",
      "On kind: you built the image locally but did not run kind load",
    ],
    check: [
      "kubectl describe pod POD   # the exact pull error",
      "kind load docker-image IMAGE:TAG --name NAME",
    ],
  },
  {
    name: "CrashLoopBackOff",
    tone: "red",
    means:
      "The container starts, exits, gets restarted, exits again. Kubernetes is backing off between restarts.",
    causes: [
      "The app throws on startup (missing env var, bad config)",
      "It cannot reach a dependency and exits",
      "The command or entrypoint is wrong",
      "A liveness probe kills it before it is ready",
    ],
    check: [
      "kubectl logs POD --previous   # logs of the crashed run",
      "kubectl describe pod POD   # Last State and Exit Code",
    ],
  },
  {
    name: "OOMKilled",
    tone: "violet",
    means:
      "It used more memory than its limit, so the kernel killed it. Shows as the last state, exit code 137.",
    causes: [
      "Limit set too low for the real workload",
      "A memory leak",
      "A runtime that ignores container limits (old JVM settings)",
    ],
    check: [
      "kubectl describe pod POD | grep -A3 'Last State'",
      "kubectl top pod POD   # needs metrics-server",
    ],
  },
  {
    name: "Running, 0/1 READY",
    tone: "blue",
    means: "The process is up but the readiness probe fails, so the Service sends it no traffic.",
    causes: [
      "Probe path or port is wrong",
      "The app is still warming up",
      "A dependency it checks is down",
    ],
    check: [
      "kubectl describe pod POD   # Readiness probe failed: ...",
      "kubectl get endpointslices -l kubernetes.io/service-name=SVC",
    ],
  },
  {
    name: "CreateContainerConfigError",
    tone: "green",
    means: "The image is fine, but the pod refers to config that does not exist.",
    causes: [
      "A Secret or ConfigMap name or key is wrong",
      "It was created in a different namespace",
    ],
    check: ["kubectl describe pod POD", "kubectl get secret,configmap -n NAMESPACE"],
  },
];

export default function PodStatusExplorer() {
  const [picked, setPicked] = useState(0);

  return (
    <div className="my-8 rounded-2xl border border-rule bg-paper-raised p-4">
      <div role="tablist" aria-label="Pod status" className="flex flex-wrap gap-2 print:hidden">
        {STATUSES.map((s, i) => (
          <button
            key={s.name}
            type="button"
            role="tab"
            aria-selected={picked === i}
            data-tone={s.tone}
            onClick={() => setPicked(i)}
            className={cn(
              "rounded-full border-2 border-(--tone) px-3 py-1 font-mono text-sm font-semibold transition",
              picked === i
                ? "tut-glow bg-(--tone) text-paper"
                : "text-(--tone) hover:bg-(--tone-soft)",
            )}
          >
            {s.name}
          </button>
        ))}
      </div>
      {STATUSES.map((s, i) => (
        <section
          key={s.name}
          data-tone={s.tone}
          role="tabpanel"
          className={cn(
            "mt-4 rounded-xl border-l-[6px] border-(--tone) bg-(image:--tone-fill) p-4",
            picked !== i && "hidden print:block",
          )}
        >
          <p className="font-mono font-bold text-(--tone)">{s.name}</p>
          <p className="mt-1 text-ink">{s.means}</p>
          <p className="mt-3 text-sm font-semibold text-ink">Usual causes</p>
          <ul className="mt-1 list-disc pl-5 text-sm text-ink">
            {s.causes.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-(--code-bg) p-3 text-sm text-(--code-fg)">
            {s.check.map((line) => {
              const [cmd, comment] = line.split("#");
              return (
                <span key={line} className="block">
                  {cmd}
                  {comment && <span className="text-(--code-comment)">#{comment}</span>}
                </span>
              );
            })}
          </pre>
        </section>
      ))}
    </div>
  );
}
