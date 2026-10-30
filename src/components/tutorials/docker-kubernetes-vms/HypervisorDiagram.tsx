/*
 * HypervisorDiagram.tsx
 * Type 1 (bare metal) next to Type 2 (hosted) hypervisor stacks, drawn from hardware up so
 * the extra host OS layer in Type 2 is visible. Server-rendered SVG.
 */

import { Arrow, Box, Label } from "@/components/tutorials/docker-kubernetes-vms/diagram";

export default function HypervisorDiagram() {
  return (
    <svg
      viewBox="0 0 420 300"
      role="img"
      aria-label="Two stacks drawn from hardware upward. Type 1: hardware, then a hypervisor, then two virtual machines. Type 2: hardware, then a host operating system, then a hypervisor program, then two virtual machines. Type 2 has one extra layer."
      className="w-full"
    >
      <Label x={102} y={22}>
        Type 1: bare metal
      </Label>
      <Box x={10} y={36} width={88} height={52} tone="pink" title="VM A" seed={1} />
      <Box x={106} y={36} width={88} height={52} tone="pink" title="VM B" seed={2} />
      <Box x={10} y={112} width={184} height={46} tone="violet" title="Hypervisor" seed={3} />
      <Box x={10} y={182} width={184} height={46} tone="blue" title="Hardware" seed={4} />
      <Arrow x1={102} y1={180} x2={102} y2={162} seed={5} curve={0} />
      <Arrow x1={102} y1={110} x2={102} y2={92} seed={6} curve={0} />

      <Label x={318} y={22}>
        Type 2: hosted
      </Label>
      <Box x={226} y={36} width={88} height={52} tone="pink" title="VM A" seed={7} />
      <Box x={322} y={36} width={88} height={52} tone="pink" title="VM B" seed={8} />
      <Box x={226} y={106} width={184} height={40} tone="violet" title="Hypervisor app" seed={9} />
      <Box x={226} y={162} width={184} height={40} tone="amber" title="Host OS" seed={10} />
      <Box x={226} y={218} width={184} height={40} tone="blue" title="Hardware" seed={11} />

      <Label x={210} y={286}>
        Type 2 pays for one more layer: a full host OS.
      </Label>
    </svg>
  );
}
