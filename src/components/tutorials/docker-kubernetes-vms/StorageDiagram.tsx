/*
 * StorageDiagram.tsx
 * The three places a container's files can live, and which ones survive `docker rm`.
 * Server-rendered SVG.
 */

import { Arrow, Box, Label } from "@/components/tutorials/docker-kubernetes-vms/diagram";

export default function StorageDiagram() {
  return (
    <svg
      viewBox="0 0 720 270"
      role="img"
      aria-label="A container writes to three places. Its writable layer is deleted with the container. A named volume is managed by Docker and survives removal, which suits databases. A bind mount is a folder on your machine, which suits live code in development."
      className="w-full"
    >
      <Box
        x={210}
        y={10}
        width={300}
        height={60}
        tone="docker"
        title="Container"
        note="writes to /tmp, /data, /app"
        seed={1}
      />
      <Arrow x1={300} y1={72} x2={120} y2={146} seed={2} />
      <Arrow x1={360} y1={72} x2={360} y2={146} seed={3} />
      <Arrow x1={420} y1={72} x2={600} y2={146} seed={4} />
      <Box
        x={10}
        y={150}
        width={220}
        height={74}
        tone="red"
        title="Writable layer"
        note="gone on docker rm"
        seed={5}
      />
      <Box
        x={250}
        y={150}
        width={220}
        height={74}
        tone="green"
        title="Named volume"
        note="-v hits-data:/data"
        seed={6}
      />
      <Box
        x={490}
        y={150}
        width={220}
        height={74}
        tone="blue"
        title="Bind mount"
        note="-v ./src:/app/src"
        seed={7}
      />
      <Label x={120} y={250}>
        scratch files only
      </Label>
      <Label x={360} y={250}>
        databases, uploads (survives)
      </Label>
      <Label x={600} y={250}>
        live code in dev (your folder)
      </Label>
    </svg>
  );
}
