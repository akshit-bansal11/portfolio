/*
 * SidecarDiagram.tsx
 * How a service mesh is wired: each service talks only to its
 * own sidecar proxy, the proxies talk to each other over
 * encrypted connections (the data plane), and a control plane
 * hands every proxy its routing rules, policies and
 * certificates.
 */

import { DrawnPath } from "@/components/blog/Annotation";
import { sketchArrow, sketchRect } from "@/lib/blog/sketch";

const CALL = sketchArrow(164, 140, 236, 140, { seed: 3, curve: 0.04, headSize: 8 });
const CONFIG_LEFT = sketchArrow(160, 54, 138, 120, { seed: 4, curve: 0.1, headSize: 7 });
const CONFIG_RIGHT = sketchArrow(240, 54, 262, 120, { seed: 5, curve: -0.1, headSize: 7 });

function Pod({
  x,
  service,
  seed,
  sidecarLeft,
}: {
  x: number;
  service: string;
  seed: number;
  sidecarLeft?: boolean;
}) {
  // The sidecar sits on the side facing the other pod.
  const serviceX = sidecarLeft ? x - 4 : x - 62;
  const sidecarX = sidecarLeft ? x - 62 : x + 12;
  return (
    <g>
      <path
        d={sketchRect(x - 70, 112, 140, 90, { seed, bow: 1.5 })}
        fill="none"
        strokeWidth={1.3}
        strokeDasharray="5 4"
        className="stroke-ink-muted"
      />
      <text x={x - 64} y={196} className="fill-ink-muted font-hand text-[13px]">
        one pod / host
      </text>
      <rect
        x={serviceX}
        y={150}
        width={66}
        height={30}
        rx={5}
        className="fill-paper-raised stroke-ink"
        strokeWidth={1.6}
      />
      <text
        x={serviceX + 33}
        y={165}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-ink text-[11px] font-semibold"
      >
        {service}
      </text>
      <rect
        x={sidecarX}
        y={124}
        width={50}
        height={40}
        rx={8}
        className="fill-ok/20 stroke-ok"
        strokeWidth={1.8}
      />
      <text
        x={sidecarX + 25}
        y={144}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-ink text-[10px] font-bold"
      >
        sidecar
      </text>
    </g>
  );
}

export default function SidecarDiagram() {
  return (
    <svg
      viewBox="0 0 400 226"
      role="img"
      aria-label="Two pods, each holding a service and a sidecar proxy. The services only talk to their own sidecar. The two sidecars talk to each other over an encrypted connection, the data plane. Above them, a control plane sends routing rules, security policies and certificates to every sidecar."
      className="w-full"
    >
      <rect
        x={130}
        y={14}
        width={140}
        height={40}
        rx={8}
        className="fill-pen/15 stroke-pen"
        strokeWidth={1.8}
      />
      <text
        x={200}
        y={34}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-ink text-[12px] font-bold"
      >
        control plane
      </text>

      <Pod x={100} service="Orders" seed={11} />
      <Pod x={300} service="Payments" seed={12} sidecarLeft />

      <g className="text-pen">
        <DrawnPath d={CONFIG_LEFT.shaft} strokeWidth={1.6} />
        <DrawnPath d={CONFIG_LEFT.head} strokeWidth={1.6} delay={0.9} duration={0.15} />
        <DrawnPath d={CONFIG_RIGHT.shaft} strokeWidth={1.6} delay={0.2} />
        <DrawnPath d={CONFIG_RIGHT.head} strokeWidth={1.6} delay={1.1} duration={0.15} />
        <text x={286} y={78} className="fill-pen font-hand text-[14px]">
          rules, policies,
        </text>
        <text x={286} y={92} className="fill-pen font-hand text-[14px]">
          certificates
        </text>
      </g>
      <g className="text-ok">
        <DrawnPath d={CALL.shaft} strokeWidth={2.6} delay={1.2} duration={0.5} />
        <DrawnPath d={CALL.head} strokeWidth={2.6} delay={1.7} duration={0.15} />
        <text x={200} y={128} textAnchor="middle" className="fill-ok font-hand text-[14px]">
          mTLS
        </text>
      </g>
      <text x={200} y={222} textAnchor="middle" className="fill-ink-muted font-hand text-[14px]">
        services talk to their own sidecar; sidecars talk to each other
      </text>
    </svg>
  );
}
