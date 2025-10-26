import mongoose, { Schema, Document } from "mongoose";

export interface IMateria extends Document {
  codigo_materia: string;
  nombre_materia: string;
  carrera_id: mongoose.Types.ObjectId;
  anio_carrera: number;
  cuatrimestre: number;
}

const MateriaSchema: Schema = new Schema({
  codigo_materia: { type: String, required: true, unique: true },
  nombre_materia: { type: String, required: true, unique: true },
  carrera_id: { type: Schema.Types.ObjectId, ref: "Carrera", required: true },
  anio_carrera: { type: Number, required: true },
  cuatrimestre: { type: Number, required: true },
});

export default mongoose.models.Materia ||
  mongoose.model<IMateria>("Materia", MateriaSchema);
