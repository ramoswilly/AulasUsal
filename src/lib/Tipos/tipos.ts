export const BuildingTypes = [
  "Genérico",
  "Centro Tecnológico",
  "Laboratorio",
  "Edificio veterinario",
] as const;

export type BuildingType = (typeof BuildingTypes)[number];
