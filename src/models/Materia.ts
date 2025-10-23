import mongoose, { Schema, Document } from 'mongoose';

export interface IMateria extends Document {
  nombre_materia: string;
  anio_carrera: number;
  cuatrimestre: number;
  carrera_id: mongoose.Types.ObjectId;
}

const MateriaSchema: Schema = new Schema({
  nombre_materia: { type: String, required: true, unique: true },
  anio_carrera: { type: Number },
  cuatrimestre: { type: Number },
  carrera_id: { type: Schema.Types.ObjectId, ref: 'Carrera', required: true },
});

export default mongoose.models.Materia || mongoose.model<IMateria>('Materia', MateriaSchema);
