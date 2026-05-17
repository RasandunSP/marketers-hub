import type { Resource } from "./resources";

/** Uniform tile width — all types share the same grid footprint for consistent card size. */
const TILE_CLASS = "col-span-3 md:col-span-3";

export function getComicTileClass(_resource: Resource): string {
  return TILE_CLASS;
}
