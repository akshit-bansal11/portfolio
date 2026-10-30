/*
 * ClusterDiagram.tsx
 * Anatomy of a Kubernetes cluster: the control plane (API server, etcd, scheduler,
 * controller manager) on top, and two worker nodes (kubelet, kube-proxy, containerd, pods)
 * below, with the kubelets talking to the API server. Server-rendered SVG.
 */

import { Arrow, Box, Label } from "@/components/tutorials/docker-kubernetes-vms/diagram";

export default function ClusterDiagram() {
  return (
    <svg
      viewBox="0 0 420 400"
      role="img"
      aria-label="A Kubernetes cluster. The control plane holds the API server, etcd, the scheduler and the controller manager. Below it, two worker nodes each run a kubelet, kube-proxy and a container runtime, and host the pods. Each kubelet talks to the API server."
      className="w-full"
    >
      <Label x={210} y={20}>
        Control plane (the brain)
      </Label>
      <Box x={10} y={30} width={196} height={50} tone="blue" title="API server" seed={1} />
      <Box
        x={214}
        y={30}
        width={196}
        height={50}
        tone="amber"
        title="etcd"
        note="the memory"
        seed={2}
      />
      <Box x={10} y={90} width={196} height={50} tone="violet" title="Scheduler" seed={3} />
      <Box
        x={214}
        y={90}
        width={196}
        height={50}
        tone="green"
        title="Controllers"
        note="reconcile loops"
        seed={4}
      />

      <Arrow x1={108} y1={150} x2={108} y2={206} seed={5} curve={0.05} />
      <Arrow x1={312} y1={150} x2={312} y2={206} seed={6} curve={-0.05} />
      <Label x={124} y={184} anchor="start">
        kubelets ask and report
      </Label>

      <Label x={108} y={226}>
        Worker node 1
      </Label>
      <Label x={312} y={226}>
        Worker node 2
      </Label>
      <Box x={10} y={236} width={196} height={40} tone="cyan" title="kubelet" seed={7} />
      <Box x={10} y={284} width={196} height={40} tone="cyan" title="kube-proxy" seed={8} />
      <Box x={10} y={332} width={196} height={40} tone="green" title="containerd" seed={9} />
      <Box x={214} y={236} width={196} height={40} tone="cyan" title="kubelet" seed={10} />
      <Box x={214} y={284} width={196} height={40} tone="cyan" title="kube-proxy" seed={11} />
      <Box x={214} y={332} width={196} height={40} tone="green" title="containerd" seed={12} />
      <Label x={210} y={392}>
        Pods run on the nodes, started by the kubelet.
      </Label>
    </svg>
  );
}
