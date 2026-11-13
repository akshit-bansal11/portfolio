/*
 * PodStatusExplorer.tsx
 * The pod statuses you will actually see in `kubectl get pods`, as tabs. Each one shows the
 * line you would see, how far along its life the pod got (scheduled, image pulled, created,
 * started, ready) and where it is stuck, a small animation of what is going wrong (the
 * back-off between retries, memory climbing past the limit, a probe failing), what the
 * status means, the usual causes, and the commands that find the real cause. The printed
 * copy lists every status with its stage strip.
 */

"use client";

import { Check, Loader2, RotateCw, X } from "lucide-react";
import { type CSSProperties, useState } from "react";
import type { Tone } from "@/components/tutorials/Flow";
import { cn } from "@/lib/utils";
import { CHOICE, FRAME, motion, tabKeys } from "./ui";

type Mode = "wait" | "fail" | "loop";
type Detail = "nofit" | "pulling" | "backoff" | "oom" | "probe" | "config";

interface Status {
  id: string;
  name: string;
  tone: Tone;
  /** What `kubectl get pods` prints: READY, STATUS, RESTARTS. */
  row: [string, string, string];
  /** The life stage the pod is stuck at, and how. */
  stage: number;
  mode: Mode;
  detail: Detail;
  means: string;
  causes: string[];
  check: string[];
}

const STAGES = ["Scheduled", "Image pulled", "Created", "Started", "Ready"];

const STATUSES: Status[] = [
  {
    id: "pending",
    name: "Pending",
    tone: "amber",
    row: ["0/1", "Pending", "0"],
    stage: 0,
    mode: "wait",
    detail: "nofit",
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
    id: "creating",
    name: "ContainerCreating",
    tone: "cyan",
    row: ["0/1", "ContainerCreating", "0"],
    stage: 1,
    mode: "wait",
    detail: "pulling",
    means:
      "A node took it and is pulling the image and mounting volumes. Normal for a few seconds.",
    causes: [
      "A big image still downloading",
      "A volume, ConfigMap or Secret it mounts does not exist",
    ],
    check: ["kubectl describe pod POD", "kubectl get events --sort-by=.lastTimestamp"],
  },
  {
    id: "pull",
    name: "ImagePullBackOff",
    tone: "pink",
    row: ["0/1", "ImagePullBackOff", "0"],
    stage: 1,
    mode: "fail",
    detail: "backoff",
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
    id: "crash",
    name: "CrashLoopBackOff",
    tone: "red",
    row: ["0/1", "CrashLoopBackOff", "6"],
    stage: 3,
    mode: "loop",
    detail: "backoff",
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
    id: "oom",
    name: "OOMKilled",
    tone: "violet",
    row: ["0/1", "OOMKilled", "3"],
    stage: 3,
    mode: "fail",
    detail: "oom",
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
    id: "unready",
    name: "Running, 0/1 READY",
    tone: "blue",
    row: ["0/1", "Running", "0"],
    stage: 4,
    mode: "fail",
    detail: "probe",
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
    id: "config",
    name: "CreateContainerConfigError",
    tone: "green",
    row: ["0/1", "CreateContainerConfigError", "0"],
    stage: 2,
    mode: "fail",
    detail: "config",
    means: "The image is fine, but the pod refers to config that does not exist.",
    causes: [
      "A Secret or ConfigMap name or key is wrong",
      "It was created in a different namespace",
    ],
    check: ["kubectl describe pod POD", "kubectl get secret,configmap -n NAMESPACE"],
  },
];

// How far the pod got: done stages, the stuck one, and the ones it never reached.
function StageStrip({ status }: { status: Status }) {
  const StuckIcon = status.mode === "wait" ? Loader2 : status.mode === "loop" ? RotateCw : X;
  return (
    <ol aria-label="Pod life stages" className="relative grid list-none grid-cols-5 p-0 text-center">
      <span aria-hidden className="absolute top-4 right-[10%] left-[10%] h-[2px] bg-rule" />
      <span
        aria-hidden
        data-tone="green"
        className="absolute top-4 left-[10%] h-[2px] origin-left bg-(--tone-line)"
        style={{ width: `${status.stage * 20}%` }}
      />
      {STAGES.map((stage, i) => {
        const done = i < status.stage;
        const stuck = i === status.stage;
        return (
          <li
            key={stage}
            data-tone={done ? "green" : status.tone}
            className={cn(
              "relative flex flex-col items-center gap-1",
              motion.cascade,
              !done && !stuck && "opacity-45",
            )}
            style={{ "--i": i } as CSSProperties}
          >
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border bg-paper",
                done && "border-(--tone-line) text-(--tone)",
                stuck && "border-(--tone) bg-(--tone-soft) text-(--tone)",
                stuck && status.mode === "fail" && "tut-shake",
                !done && !stuck && "border-dashed border-rule text-ink-muted",
              )}
              style={{ "--delay": "0.9s" } as CSSProperties}
            >
              {done && <Check className="h-4 w-4" aria-hidden />}
              {stuck && (
                <StuckIcon
                  className={cn("h-4 w-4", status.mode !== "fail" && motion.spin)}
                  aria-hidden
                />
              )}
            </span>
            <span
              className={cn(
                "text-[0.68rem] leading-tight sm:text-xs",
                stuck ? "font-semibold text-(--tone)" : "text-ink-muted",
              )}
            >
              {stage}
              <span className="sr-only">
                {done ? ": done" : stuck ? `: stuck (${status.mode})` : ": not reached"}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

// Retry back-off: each wait doubles (10 s, 20 s, 40 s...) up to five minutes.
const BACKOFF = [10, 20, 40, 80, 160, 300];

function Backoff({ verb }: { verb: string }) {
  return (
    <div>
      <p className="text-xs text-ink-muted">
        Each failed {verb} waits twice as long as the last, capped at five minutes:
      </p>
      <div aria-hidden className="mt-2 flex items-center">
        {BACKOFF.map((wait, i) => (
          <div
            key={wait}
            className="flex min-w-9 items-center"
            style={{ flexGrow: Math.sqrt(wait) }}
          >
            <span
              className="tut-pop flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-(--tone) bg-(--tone-soft) text-(--tone)"
              style={{ "--delay": `${i * 0.45}s` } as CSSProperties}
            >
              <X className="h-3 w-3" />
            </span>
            <span className="relative mx-0.5 h-5 flex-1">
              <span
                className={cn(
                  motion.fill,
                  "absolute inset-x-0 top-1/2 border-t-[1.5px] border-dashed border-(--tone-line)",
                )}
                style={{ "--delay": `${i * 0.45 + 0.15}s`, "--dur": "0.3s" } as CSSProperties}
              />
              <span className="absolute inset-x-0 -top-2.5 text-center font-mono text-[0.62rem] text-ink-muted">
                {wait === 300 ? "5m" : `${wait}s`}
              </span>
            </span>
          </div>
        ))}
        <span className="font-mono text-xs text-ink-muted">…</span>
      </div>
    </div>
  );
}

// The small "what is going wrong" animation for one status.
function DetailView({ status }: { status: Status }) {
  switch (status.detail) {
    case "nofit":
      return (
        <div>
          <p className="text-xs text-ink-muted">
            The pod requests <b className="text-ink">2 CPU</b>. Free CPU on each node:
          </p>
          <ul className="mt-2 grid list-none grid-cols-3 gap-2 p-0">
            {[0.5, 1.2, 0.8].map((free, i) => (
              <li key={free} className="text-xs text-ink-muted">
                <span className="flex justify-between font-mono">
                  node-{i + 1} <span className="text-(--tone)">{free}</span>
                </span>
                <span className="relative mt-1 block h-2 overflow-hidden rounded-full bg-rule">
                  <span
                    className={cn(motion.fill, "absolute inset-y-0 left-0 rounded-full bg-(--tone)")}
                    style={
                      {
                        width: `${(free / 2) * 100}%`,
                        "--delay": `${i * 0.2}s`,
                      } as CSSProperties
                    }
                  />
                  <span className="absolute inset-y-0 right-0 w-px bg-ink-muted" />
                </span>
              </li>
            ))}
          </ul>
        </div>
      );
    case "pulling":
      return (
        <div>
          <p className="flex justify-between font-mono text-xs text-ink-muted">
            <span>Pulling image web:1.4</span>
            <span>412 MB</span>
          </p>
          <span className="relative mt-1.5 block h-2 overflow-hidden rounded-full bg-rule">
            <span
              className={cn(motion.fill, "absolute inset-0 rounded-full bg-(--tone)")}
              style={{ "--dur": "3s" } as CSSProperties}
            />
          </span>
        </div>
      );
    case "backoff":
      return <Backoff verb={status.mode === "loop" ? "restart" : "pull"} />;
    case "oom":
      return (
        <div>
          <p className="flex justify-between text-xs text-ink-muted">
            <span>Memory used</span>
            <span className="font-mono">limit 256Mi</span>
          </p>
          <span className="relative mt-1.5 block h-3 rounded-full bg-rule">
            <span
              className={cn(motion.fill, "absolute inset-y-0 left-0 w-full rounded-full bg-(--tone-line)")}
              style={{ "--dur": "2s" } as CSSProperties}
            />
            <span
              data-tone="red"
              className="tut-pop absolute inset-y-0 right-0 left-[80%] rounded-r-full bg-(--tone)"
              style={{ "--delay": "1.7s" } as CSSProperties}
            />
            <span className="absolute -inset-y-1 left-[80%] w-[2px] bg-ink" />
          </span>
          <p
            data-tone="red"
            className={cn(motion.done, "mt-1.5 text-right font-mono text-xs font-semibold text-(--tone)")}
            style={{ "--done": "2s" } as CSSProperties}
          >
            killed by the kernel · exit code 137
          </p>
        </div>
      );
    case "probe":
      return (
        <div>
          <p className="text-xs text-ink-muted">
            Readiness probe <span className="font-mono">GET /healthz</span>, every 10 s:
          </p>
          <ul aria-hidden className="mt-2 flex list-none flex-wrap gap-1.5 p-0">
            {[0, 1, 2, 3, 4].map((i) => (
              <li
                key={i}
                className="tut-pop flex items-center gap-1 rounded-md border border-(--tone-line) bg-paper px-1.5 font-mono text-xs text-ink"
                style={{ "--delay": `${i * 0.4}s` } as CSSProperties}
              >
                <X className="h-3 w-3 text-(--tone)" /> 503
              </li>
            ))}
          </ul>
          <p className="mt-2 font-mono text-xs text-ink-muted">Service endpoints: 0 ready</p>
        </div>
      );
    case "config":
      return (
        <p className="font-mono text-xs text-ink">
          <span
            className="tut-shake inline-block rounded-md border border-dashed border-(--tone) bg-(--tone-soft) px-2 py-1"
            style={{ "--delay": "0.6s" } as CSSProperties}
          >
            secret &quot;db-pass&quot; not found
          </span>
        </p>
      );
  }
}

export default function PodStatusExplorer() {
  const [picked, setPicked] = useState(0);

  return (
    <div data-widget="pod-status" data-tone={STATUSES[picked].tone} className={FRAME}>
      <div role="tablist" aria-label="Pod status" className="flex flex-wrap gap-2 print:hidden">
        {STATUSES.map((s, i) => (
          <button
            key={s.id}
            id={`pod-status-tab-${s.id}`}
            type="button"
            role="tab"
            aria-selected={picked === i}
            aria-controls={`pod-status-panel-${s.id}`}
            tabIndex={picked === i ? 0 : -1}
            data-tone={s.tone}
            onClick={() => setPicked(i)}
            onKeyDown={(event) => tabKeys(event, i, STATUSES.length, setPicked)}
            className={cn(CHOICE, "rounded-full font-mono")}
          >
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-(--tone)" />
            {s.name}
          </button>
        ))}
      </div>
      {STATUSES.map((s, i) => (
        <section
          key={s.id}
          id={`pod-status-panel-${s.id}`}
          role="tabpanel"
          aria-labelledby={`pod-status-tab-${s.id}`}
          data-tone={s.tone}
          className={cn(
            "mt-4 rounded-xl border border-(--tone-line) bg-paper p-4 print:mt-3 print:break-inside-avoid",
            picked !== i && "hidden print:block",
            picked === i && motion["slide-in"],
          )}
        >
          {/* The line you would see. */}
          <div className="overflow-x-auto rounded-lg border border-rule bg-paper-raised px-3 py-2 font-mono text-xs">
            <p className="text-ink-muted">$ kubectl get pods</p>
            <table className="mt-1 w-full min-w-[26rem] text-left">
              <thead className="text-ink-muted">
                <tr>
                  <th className="pr-3 font-normal">NAME</th>
                  <th className="pr-3 font-normal">READY</th>
                  <th className="pr-3 font-normal">STATUS</th>
                  <th className="pr-3 font-normal">RESTARTS</th>
                  <th className="font-normal">AGE</th>
                </tr>
              </thead>
              <tbody className="text-ink">
                <tr>
                  <td className="pr-3">web-7d4f9</td>
                  <td className="pr-3">{s.row[0]}</td>
                  <td className="pr-3">
                    <span className="rounded bg-(--tone-soft) px-1 font-semibold text-(--tone)">
                      {s.row[1]}
                    </span>
                  </td>
                  <td className="pr-3">{s.row[2]}</td>
                  <td>3m</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <StageStrip status={s} />
          </div>

          <div className="mt-4 rounded-lg border border-dashed border-(--tone-line) bg-(--tone-soft) p-3 print:hidden">
            <DetailView status={s} />
          </div>

          <p className="mt-4 font-mono font-bold text-(--tone)">{s.name}</p>
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
