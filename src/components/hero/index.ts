/*
 * index.ts
 * Public entry point for the scroll hero feature.
 * Importers should pull from this module instead of
 * reaching into individual hero internals.
 */

// Empty buffer that adds scroll distance after the hero.
export { default as HeroToContentSpacer } from "./HeroToContentSpacer";
// The pinned, scroll-driven, four-stage hero canvas.
export { default as ScrollHero } from "./ScrollHero";
