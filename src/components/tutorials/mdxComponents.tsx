/*
 * mdxComponents.tsx
 * The tutorial kit as an MDX components map. Passed to a tutorial's <Content /> only, so
 * these overrides (IDE code windows, tabs, flows, steps...) never reach the blog. The blog
 * components from src/mdx-components.tsx stay available underneath.
 */

import type { MDXComponents } from "mdx/types";
import Callout from "@/components/tutorials/Callout";
import CodeWindow from "@/components/tutorials/CodeWindow";
import FeatureGrid from "@/components/tutorials/FeatureGrid";
import Flow from "@/components/tutorials/Flow";
import { Logo, LogoRow } from "@/components/tutorials/Logo";
import Quiz from "@/components/tutorials/Quiz";
import { Step, Steps } from "@/components/tutorials/Steps";
import Tabs, { Tab } from "@/components/tutorials/Tabs";
import Term from "@/components/tutorials/Term";
import { Trouble, TroubleGroup } from "@/components/tutorials/Trouble";

export const tutorialComponents: MDXComponents = {
  pre: CodeWindow,
  // Bold text is a key term in tutorials, so it takes the term colour.
  strong: (props) => <strong data-tone="term" className="font-semibold text-(--tone)" {...props} />,
  Callout,
  FeatureGrid,
  Flow,
  Logo,
  LogoRow,
  Quiz,
  Step,
  Steps,
  Tab,
  Tabs,
  Term,
  Trouble,
  TroubleGroup,
};
