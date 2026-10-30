/*
 * StackExplorer.tsx
 * Three stacks side by side (virtual machines, containers, pods on a cloud node), drawn
 * from the app down to the hardware. Pressing a layer explains it below and highlights the
 * same layer in every stack, so "containers share one kernel" is something you can see.
 */

"use client";

import { useState } from "react";
import type { Tone } from "@/components/tutorials/Flow";
import { cn } from "@/lib/utils";

type LayerId = "app" | "libs" | "runtime" | "agent" | "kernel" | "hypervisor" | "hardware";

interface Layer {
  id: LayerId;
  label: string;
  /** How many separate copies of this layer the stack has. */
  copies: number;
}

interface Stack {
  name: string;
  note: string;
  layers: Layer[];
}

const TONES: Record<LayerId, Tone> = {
  app: "pink",
  libs: "cyan",
  runtime: "green",
  agent: "violet",
  kernel: "amber",
  hypervisor: "violet",
  hardware: "blue",
};

const EXPLAIN: Record<LayerId, { title: string; text: string }> = {
  app: {
    title: "Your app",
    text: "The code you wrote. In every stack it is the only part that changes from project to project.",
  },
  libs: {
    title: "Libraries and files",
    text: "Each VM or container carries its own copy of the libraries and the files an OS normally provides (the Alpine or Debian files). This is what lets two apps want different versions without fighting. It is files only, not a running kernel.",
  },
  runtime: {
    title: "Container runtime",
    text: "Docker Engine or containerd. It turns an image into an ordinary process on the host and wraps it with namespaces (what it can see) and cgroups (how much it can use). It is not a second OS.",
  },
  agent: {
    title: "kubelet",
    text: "The Kubernetes agent on each node. It asks the control plane what should run on this node, tells the runtime to start it and reports back. This is the layer Docker alone does not have.",
  },
  kernel: {
    title: "The kernel",
    text: "The core of an operating system: it owns the hardware and enforces who may touch what. Each VM boots its own guest kernel (two copies on the left). Containers and pods on one machine all share one kernel (a single box). That sharing is why containers start in a blink and weigh little, and also why a container cannot run a different OS kernel than its host.",
  },
  hypervisor: {
    title: "Hypervisor",
    text: "Software that slices one physical machine into several virtual ones and keeps them apart. Cloud providers run one under every rented server, which is why the Kubernetes nodes on the right usually sit on top of one as well. On Windows and macOS, Docker Desktop starts a small Linux VM, so the middle stack really runs inside the left one.",
  },
  hardware: {
    title: "Hardware",
    text: "The real CPU, RAM, disk and network card. Everything above is a way of sharing it.",
  },
};

const STACKS: Stack[] = [
  {
    name: "Virtual machines",
    note: "one full OS each",
    layers: [
      { id: "app", label: "Apps", copies: 2 },
      { id: "libs", label: "Libraries", copies: 2 },
      { id: "kernel", label: "Guest OS kernel", copies: 2 },
      { id: "hypervisor", label: "Hypervisor", copies: 1 },
      { id: "hardware", label: "Hardware", copies: 1 },
    ],
  },
  {
    name: "Containers",
    note: "one kernel, shared",
    layers: [
      { id: "app", label: "Apps", copies: 2 },
      { id: "libs", label: "Libraries", copies: 2 },
      { id: "runtime", label: "Container runtime", copies: 1 },
      { id: "kernel", label: "Host OS kernel", copies: 1 },
      { id: "hardware", label: "Hardware", copies: 1 },
    ],
  },
  {
    name: "Pods on a cloud node",
    note: "containers, plus a VM underneath",
    layers: [
      { id: "app", label: "Pods", copies: 2 },
      { id: "libs", label: "Libraries", copies: 2 },
      { id: "agent", label: "kubelet", copies: 1 },
      { id: "runtime", label: "containerd", copies: 1 },
      { id: "kernel", label: "Node OS kernel", copies: 1 },
      { id: "hypervisor", label: "Cloud hypervisor", copies: 1 },
      { id: "hardware", label: "Hardware", copies: 1 },
    ],
  },
];

export default function StackExplorer() {
  const [selected, setSelected] = useState<LayerId>("kernel");
  const info = EXPLAIN[selected];

  return (
    <div className="my-8">
      <div className="grid gap-4 md:grid-cols-3">
        {STACKS.map((stack) => (
          <div key={stack.name}>
            <p className="font-semibold text-ink">{stack.name}</p>
            <p className="mb-2 text-sm text-ink-muted">{stack.note}</p>
            <div className="flex flex-col gap-1.5">
              {stack.layers.map((layer) => (
                <button
                  key={layer.id}
                  type="button"
                  data-tone={TONES[layer.id]}
                  aria-pressed={selected === layer.id}
                  aria-label={`${layer.label}, ${layer.copies} ${layer.copies > 1 ? "copies" : "copy"}`}
                  onClick={() => setSelected(layer.id)}
                  className={cn(
                    "min-h-11 w-full cursor-pointer rounded-lg border-2 border-(--tone) bg-(--tone-soft) px-2 py-1.5 text-left text-sm text-ink",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pen",
                    "aria-pressed:bg-(--tone) aria-pressed:font-semibold aria-pressed:text-paper",
                  )}
                >
                  <span className="block">{layer.label}</span>
                  <span aria-hidden className="mt-1 flex gap-1">
                    {Array.from({ length: layer.copies }, (_, index) => (
                      <span key={index} className="h-1.5 flex-1 rounded-sm bg-current opacity-60" />
                    ))}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div
        data-tone={TONES[selected]}
        aria-live="polite"
        className="mt-4 rounded-xl border-l-4 border-(--tone) bg-(--tone-soft) p-4"
      >
        <p className="font-semibold text-(--tone)">{info.title}</p>
        <p className="mt-1 text-ink">{info.text}</p>
      </div>
    </div>
  );
}
