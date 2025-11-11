import mongoose, { Schema, Document } from "mongoose";

export interface IMateria extends Document {
  codigo_materia: string;
  nombre_materia: string;
  carrera_id: mongoose.Types.ObjectId;
  anio_carrera: number;
  cuatrimestre: number;
  deletedAt?: Date | null;
}

const MateriaSchema: Schema = new Schema(
  {
    codigo_materia: { type: String, required: true },
    nombre_materia: { type: String, required: true, trim: true },
    carrera_id: { type: Schema.Types.ObjectId, ref: "Carrera", required: true },
    anio_carrera: { type: Number, required: true },
    cuatrimestre: { type: Number, enum: [1, 2], required: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Único global por código, salvo soft delete:
MateriaSchema.index(
  { codigo_materia: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } }
);

// Evitar duplicado de nombre dentro de la misma carrera (con soft delete):
MateriaSchema.index(
  { nombre_materia: 1, carrera_id: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } }
);

export default mongoose.models.Materia ||
  mongoose.model<IMateria>("Materia", MateriaSchema);
