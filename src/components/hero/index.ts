/*
 * index.ts
 * Public entry point for the scroll hero feature.
 * Importers should pull from this module instead of
 * reaching into individual hero internals.
 */

// Empty buffer that adds scroll distance after the hero.
export { default as HeroToContentSpacer } from "./HeroToContentSpacer";
// Single responsive hero — static mobile stack + pinned scroll-driven desktop canvas.
export { default as ScrollHero } from "./ScrollHero";
