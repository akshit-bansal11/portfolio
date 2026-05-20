/*
 * declarations.d.ts
 * Ambient module declarations so non-code asset imports
 * (PDF, images, SVG, etc.) typecheck cleanly with Next.js.
 */

// Allow importing PDFs as modules (used for the resume file).
declare module "*.pdf";
// Allow importing raster image formats as modules.
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
// Allow importing SVGs (used as logos / icons).
declare module "*.svg";
// Allow importing modern WebP raster images.
declare module "*.webp";
