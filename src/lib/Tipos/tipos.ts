export const BuildingTypes = [
  "Genérico",
  "Centro Tecnológico",
  "Laboratorio",
  "Edificio veterinario",
] as const;

export const ClassroomTypes = [
  "Común",
  "Laboratorio",
  "Auditorio",
  "Otro",
] as const;

export const AulaRecursos = [
  "Pizarron",
  "Proyector",
  "Television",
  "Otro",
] as const;

export type ClassroomType = (typeof ClassroomTypes)[number];
export type BuildingType = (typeof BuildingTypes)[number];
export type AulaRecurso = (typeof AulaRecursos)[number];
