/*
 * ServiceDiagram.tsx
 * Why a Service exists: a client talks to one stable name, and the Service spreads requests
 * over whichever pods are alive, even though pod IPs change. Server-rendered SVG.
 */

import { Arrow, Box, Label } from "@/components/tutorials/docker-kubernetes-vms/diagram";

export default function ServiceDiagram() {
  return (
    <svg
      viewBox="0 0 420 300"
      role="img"
      aria-label="A client sends requests to a Service named web, which has one stable address. The Service forwards each request to one of three pods. The third pod was replaced and has a new IP address, but the client never notices because it only knows the Service."
      className="w-full"
    >
      <Box x={10} y={110} width={96} height={56} tone="pink" title="Client" seed={1} />
      <Arrow x1={110} y1={138} x2={150} y2={138} seed={2} curve={0} />
      <Box
        x={154}
        y={100}
        width={104}
        height={76}
        tone="blue"
        title="Service"
        note="web (stable)"
        seed={3}
      />
      <Arrow x1={262} y1={118} x2={300} y2={52} seed={4} curve={0.1} />
      <Arrow x1={262} y1={138} x2={300} y2={138} seed={5} curve={0} />
      <Arrow x1={262} y1={158} x2={300} y2={228} seed={6} curve={-0.1} />
      <Box
        x={304}
        y={22}
        width={106}
        height={56}
        tone="green"
        title="Pod a"
        note="IP one"
        seed={7}
      />
      <Box
        x={304}
        y={110}
        width={106}
        height={56}
        tone="green"
        title="Pod b"
        note="IP two"
        seed={8}
      />
      <Box
        x={304}
        y={198}
        width={106}
        height={56}
        tone="amber"
        title="Pod c"
        note="new IP"
        seed={9}
      />
      <Label x={210} y={286}>
        Pod c was replaced. The Service name did not change.
      </Label>
    </svg>
  );
}
