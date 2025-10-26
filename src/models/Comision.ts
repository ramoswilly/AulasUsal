import mongoose, { Schema, Document } from "mongoose";

export interface IComision extends Document {
  nombre_comision: string;
  anio_dictado: number; // Año calendario en que se dicta
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
  materia_ids: mongoose.Types.ObjectId[]; // Varias materias
  carrera_ids: mongoose.Types.ObjectId[]; // Varias carreras
  anio_por_carrera: {
    carrera_id: mongoose.Types.ObjectId;
    anio: number; // Año de la carrera en que se cursa esta materia
  }[];
}

const ComisionSchema: Schema = new Schema({
  nombre_comision: { type: String, required: true },
  anio_dictado: { type: Number, required: true },
  inscriptos: { type: Number },
  profesor: { type: String },
  horario: {
    dia: { type: String, required: true },
    turno: { type: String, required: true },
  },
  asignacion: {
    aula_id: { type: Schema.Types.ObjectId, ref: "Aula" },
    fecha_asignacion: { type: Date },
  },
  materia_ids: [{ type: Schema.Types.ObjectId, ref: "Materia", required: true }],
  carrera_ids: [{ type: Schema.Types.ObjectId, ref: "Carrera" }],
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
