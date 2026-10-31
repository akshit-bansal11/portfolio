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
  /** Short bullet points under each logo, same order as `techs`. */
  points?: string[][];
}

export function LogoRow({ techs, points }: LogoRowProps) {
  return (
    <ul className="my-8 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-3">
      {techs.map((tech, i) => {
        const { name, tone, Icon } = TECH[tech];
        return (
          <li
            key={tech}
            data-tone={tone}
            className="tut-glow rounded-2xl border-2 border-(--tone) bg-(image:--tone-fill) p-4"
          >
            <p className="flex items-center gap-3 text-lg font-bold text-ink">
              <Icon className="h-10 w-10 shrink-0 text-(--tone)" aria-hidden />
              {name}
            </p>
            {points?.[i] && (
              <ul className="mt-3 list-none space-y-1.5 p-0 text-sm leading-snug text-ink">
                {points[i].map((point) => (
                  <li key={point} className="flex gap-2">
                    <span aria-hidden className="text-(--tone)">
                      ▸
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}
