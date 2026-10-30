/*
 * ReconcileDiagram.tsx
 * The reconcile loop: you write the desired state, a controller compares it with what is
 * actually running, acts to close the gap and keeps watching. Server-rendered SVG.
 */

import { Arrow, Box, Label } from "@/components/tutorials/docker-kubernetes-vms/diagram";

export default function ReconcileDiagram() {
  return (
    <svg
      viewBox="0 0 420 290"
      role="img"
      aria-label="The reconcile loop. Desired state, written by you, flows down to a controller. The controller creates or deletes pods to change the actual state. The actual state is watched and fed back to the controller, so the loop repeats forever."
      className="w-full"
    >
      <Box
        x={100}
        y={10}
        width={220}
        height={56}
        tone="blue"
        title="Desired state"
        note="replicas: 3 (you wrote it)"
        seed={1}
      />
      <Arrow x1={210} y1={70} x2={210} y2={110} seed={2} curve={0} />
      <Box
        x={100}
        y={116}
        width={220}
        height={56}
        tone="green"
        title="Controller"
        note="compare, then act"
        seed={3}
      />
      <Arrow x1={210} y1={176} x2={210} y2={216} seed={4} curve={0} />
      <Label x={222} y={200} anchor="start">
        create or delete pods
      </Label>
      <Box
        x={100}
        y={222}
        width={220}
        height={56}
        tone="amber"
        title="Actual state"
        note="2 pods running"
        seed={5}
      />
      <Arrow x1={324} y1={250} x2={324} y2={150} seed={6} curve={-0.3} />
      <Label x={346} y={206} anchor="start">
        watch
      </Label>
    </svg>
  );
}
