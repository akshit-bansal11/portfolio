/*
 * mdxComponents.tsx
 * The tutorial kit as an MDX components map. Passed to a tutorial's <Content /> only, so
 * these overrides (IDE code windows, tabs, flows, steps...) never reach the blog. The blog
 * components from src/mdx-components.tsx stay available underneath.
 */

import type { MDXComponents } from "mdx/types";
import Callout from "@/components/tutorials/Callout";
import CodeWindow from "@/components/tutorials/CodeWindow";
import Flow from "@/components/tutorials/Flow";
import { Step, Steps } from "@/components/tutorials/Steps";
import Tabs, { Tab } from "@/components/tutorials/Tabs";
import { Trouble, TroubleGroup } from "@/components/tutorials/Trouble";

export const tutorialComponents: MDXComponents = {
  pre: CodeWindow,
  Callout,
  Flow,
  Step,
  Steps,
  Tab,
  Tabs,
  Trouble,
  TroubleGroup,
};
