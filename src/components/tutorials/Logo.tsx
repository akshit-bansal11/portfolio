/*
 * Logo.tsx
 * Technology logos in their brand-like tone (Docker, Kubernetes, VM, Helm, Podman), with
 * an optional name beside them. `LogoRow` lays several out as a header strip.
 */

import type { IconType } from "react-icons";
import { SiDocker, SiHelm, SiKubernetes, SiPodman } from "react-icons/si";
import { VscVm } from "react-icons/vsc";
import type { Tone } from "@/components/tutorials/Flow";
import { cn } from "@/lib/utils";

export type Tech = "docker" | "k8s" | "vm" | "helm" | "podman";

const TECH: Record<Tech, { name: string; tone: Tone; Icon: IconType }> = {
  docker: { name: "Docker", tone: "docker", Icon: SiDocker },
  k8s: { name: "Kubernetes", tone: "k8s", Icon: SiKubernetes },
  vm: { name: "Virtual machine", tone: "vm", Icon: VscVm },
  helm: { name: "Helm", tone: "blue", Icon: SiHelm },
  podman: { name: "Podman", tone: "violet", Icon: SiPodman },
};

interface LogoProps {
  tech: Tech;
  /** Show the name next to the icon. */
  label?: boolean;
  className?: string;
}

export function Logo({ tech, label = false, className }: LogoProps) {
  const { name, tone, Icon } = TECH[tech];

  return (
    <span
      data-tone={tone}
      className={cn("inline-flex items-center gap-2 text-(--tone)", className)}
    >
      <Icon
        className="h-[1.4em] w-[1.4em] shrink-0"
        aria-hidden={label}
        aria-label={label ? undefined : name}
      />
      {label && <span className="font-semibold">{name}</span>}
    </span>
  );
}

interface LogoRowProps {
  techs: Tech[];
  /** Short line under each logo, same order as `techs`. */
  notes?: string[];
}

export function LogoRow({ techs, notes }: LogoRowProps) {
  return (
    <ul className="my-8 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-3">
      {techs.map((tech, i) => {
        const { name, tone, Icon } = TECH[tech];
        return (
          <li
            key={tech}
            data-tone={tone}
            className="tut-glow flex items-center gap-4 rounded-2xl border-2 border-(--tone) bg-(image:--tone-fill) p-4"
          >
            <Icon className="h-12 w-12 shrink-0 text-(--tone)" aria-hidden />
            <div>
              <p className="text-lg font-bold text-ink">{name}</p>
              {notes?.[i] && <p className="text-sm leading-snug text-ink-muted">{notes[i]}</p>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
