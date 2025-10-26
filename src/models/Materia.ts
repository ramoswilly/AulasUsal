import mongoose, { Schema, Document } from "mongoose";

export interface IMateria extends Document {
  codigo_materia: string;
  nombre_materia: string;
}

const MateriaSchema: Schema = new Schema({
  codigo_materia: { type: String, required: true, unique: true },
  nombre_materia: { type: String, required: true, unique: true },
});

export default mongoose.models.Materia ||
  mongoose.model<IMateria>("Materia", MateriaSchema);
