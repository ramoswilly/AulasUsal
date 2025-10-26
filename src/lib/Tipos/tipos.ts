import { Types } from 'mongoose';

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

export type ClassroomType = (typeof ClassroomTypes)[number];
export type BuildingType = (typeof BuildingTypes)[number];

export interface Carrera {
  _id: string;
  nombre_carrera: string;
  anios: number;
}

export interface Materia {
  _id: string;
  nombre_materia: string;
  anio_carrera: number;
  cuatrimestre: number;
  carrera_id: Types.ObjectId;
}
