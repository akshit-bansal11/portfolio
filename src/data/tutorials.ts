/*
 * tutorials.ts
 * Registry of published tutorials. Each slug must have a
 * matching MDX file at src/content/tutorials/<slug>.mdx.
 * Order matters: a tutorial's position is its number in the list.
 */

import type { BlogPostMeta } from "@/types/blog";

export const tutorials: BlogPostMeta[] = [
  {
    slug: "vm-101",
    title: "VM 101: Virtual Machines From Zero",
    description:
      "What a virtual machine is, in plain words: hosts, guests, hypervisors and why every cloud server is a VM. Then launch, explore and delete a real Ubuntu VM on your own machine.",
    publishedAt: "2026-10-31",
    tags: ["vm", "virtualization", "devops"],
    headerNote: "a computer inside your computer",
  },
  {
    slug: "docker-101",
    title: "Docker 101: Images and Containers From Zero",
    description:
      "Images, containers, Dockerfiles, volumes, ports and Compose, explained with everyday examples and hand-drawn diagrams. Then containerize a small web app on your own machine.",
    publishedAt: "2026-10-31",
    tags: ["docker", "containers", "devops"],
    headerNote: "ship the whole lunchbox",
  },
  {
    slug: "kubernetes-101",
    title: "Kubernetes 101: Running Containers at Scale",
    description:
      "Clusters, nodes, pods, Deployments and Services in plain words, and what really happens when you run kubectl apply. Then run, scale, break and roll back an app on a local cluster.",
    publishedAt: "2026-10-31",
    tags: ["kubernetes", "k8s", "devops"],
    headerNote: "the manager for your containers",
  },
  {
    slug: "docker-vs-kubernetes-vs-vm",
    title: "Docker vs Kubernetes vs VM: What Each One Is For",
    description:
      "How virtual machines, Docker and Kubernetes differ, how they stack together, the common mix-ups, and which one to use when. With a quick hands-on test of start time and kernels.",
    publishedAt: "2026-10-31",
    tags: ["docker", "kubernetes", "vm"],
    headerNote: "they stack, not compete",
  },
];
