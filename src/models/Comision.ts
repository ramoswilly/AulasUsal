import mongoose, { Schema, Document } from "mongoose";

export interface IComision extends Document {
  nombre_comision: string;
  anio_dictado: number;
  inscriptos: number;
  profesor: string;
  horario: {
    dia: number;
    turno: number;
    cuatrimestre: number; // 1-3
  };
  asignacion: {
    aula_id: mongoose.Types.ObjectId;
    fecha_asignacion: Date;
  };
  materia_ids: mongoose.Types.ObjectId[];
  carrera_ids: mongoose.Types.ObjectId[];
  sede_id: mongoose.Types.ObjectId;
  anio_por_carrera: {
    carrera_id: mongoose.Types.ObjectId;
    anio: number;
  }[];
}

const ComisionSchema: Schema = new Schema({
  nombre_comision: { type: String, required: true },
  anio_dictado: { type: Number, required: true },
  inscriptos: { type: Number },
  profesor: { type: String },
  horario: {
    dia: { type: Number, required: true }, // 1-6
    turno: { type: Number, required: true }, // 1-3
    cuatrimestre: { type: Number, required: true }, // 1-3
  },
  asignacion: {
    aula_id: { type: Schema.Types.ObjectId, ref: "Aula" },
    fecha_asignacion: { type: Date },
  },
  materia_ids: [
    { type: Schema.Types.ObjectId, ref: "Materia", required: true },
  ],
  carrera_ids: [
    { type: Schema.Types.ObjectId, ref: "Carrera", required: true },
  ],
  sede_id: { type: Schema.Types.ObjectId, ref: "Sede", required: true },
  anio_por_carrera: [
    {
      carrera_id: {
        type: Schema.Types.ObjectId,
        ref: "Carrera",
        required: true,
      },
      anio: { type: Number, required: true },
    },
  ],
});

export default mongoose.models.Comision ||
  mongoose.model<IComision>("Comision", ComisionSchema);
