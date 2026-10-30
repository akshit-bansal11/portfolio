/*
 * PortMapDiagram.tsx
 * How traffic reaches the walkthrough's containers: the laptop gets in only through the
 * published port, while containers on the Compose network find each other by name.
 * Server-rendered SVG.
 */

import { Arrow, Box, Label } from "@/components/tutorials/docker-kubernetes-vms/diagram";

export default function PortMapDiagram() {
  return (
    <svg
      viewBox="0 0 760 300"
      role="img"
      aria-label="Your browser calls localhost port 8080. Docker forwards the published port 8080 to the web container on port 3000. The web container reaches the redis container on port 6379 by its name over the Compose network. Redis has no published port, so the laptop cannot reach it directly. Redis keeps its data in a named volume."
      className="w-full"
    >
      <rect
        x={240}
        y={34}
        width={512}
        height={252}
        rx={14}
        fill="none"
        strokeDasharray="6 6"
        strokeWidth={2}
        className="stroke-ink-muted"
      />
      <Label x={496} y={26}>
        Docker network hits_default (has its own DNS)
      </Label>
      <Box
        x={8}
        y={100}
        width={180}
        height={70}
        tone="blue"
        title="Your browser"
        note="localhost:8080"
        seed={1}
      />
      <Box
        x={256}
        y={100}
        width={140}
        height={70}
        tone="amber"
        title="Published port"
        note="-p 8080:3000"
        seed={2}
      />
      <Box
        x={440}
        y={100}
        width={130}
        height={70}
        tone="docker"
        title="web"
        note="listens on :3000"
        seed={3}
      />
      <Box
        x={614}
        y={100}
        width={126}
        height={70}
        tone="red"
        title="redis"
        note=":6379, no -p"
        seed={4}
      />
      <Box
        x={614}
        y={208}
        width={126}
        height={60}
        tone="green"
        title="volume"
        note="hits-data"
        seed={5}
      />
      <Arrow x1={190} y1={135} x2={254} y2={135} seed={6} />
      <Arrow x1={398} y1={135} x2={438} y2={135} seed={7} />
      <Arrow x1={572} y1={135} x2={612} y2={135} seed={8} />
      <Arrow x1={677} y1={172} x2={677} y2={206} seed={9} />
      <Label x={98} y={200}>
        outside Docker
      </Label>
      <Label x={420} y={208}>
        web dials redis://redis:6379
      </Label>
      <Label x={420} y={228}>
        a name, never an IP
      </Label>
    </svg>
  );
}
