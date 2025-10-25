import mongoose, { Schema, Document } from 'mongoose';

export interface IComision extends Document {
  nombre_comision: string;
  inscriptos: number;
  profesor: string;
  horario: {
    dia: string;
    turno: string;
  };
  asignacion: {
    aula_id: mongoose.Types.ObjectId;
    fecha_asignacion: Date;
  };
  materia_ids: mongoose.Types.ObjectId[];
}

const ComisionSchema: Schema = new Schema({
  nombre_comision: { type: String, required: true },
  inscriptos: { type: Number },
  profesor: { type: String },
  horario: {
    dia: { type: String, required: true },
    turno: { type: String, required: true },
  },
  asignacion: {
    aula_id: { type: Schema.Types.ObjectId, ref: 'Aula' },
    fecha_asignacion: { type: Date },
  },
  materia_ids: [{ type: Schema.Types.ObjectId, ref: 'Materia' }],
});

export default mongoose.models.Comision || mongoose.model<IComision>('Comision', ComisionSchema);
