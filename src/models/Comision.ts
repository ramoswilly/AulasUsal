import mongoose, { Schema, Document } from "mongoose";

export interface IComision extends Document {
  nombre_comision: string;
  anio_dictado: number;
  inscriptos: number;
  profesor?: string;
  horario: {
    dia: "Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes" | "Sábado";
    turno: "MAÑANA" | "TARDE" | "NOCHE";
  };
  asignacion?: {
    aula_id: mongoose.Types.ObjectId | null;
    fecha_asignacion?: Date | null;
  };
  materia_ids: mongoose.Types.ObjectId[];  // se mantiene
  deletedAt?: Date | null;
}

const ComisionSchema = new Schema<IComision>(
  {
    nombre_comision: { type: String, required: true, trim: true },
    anio_dictado: { type: Number, required: true },
    inscriptos: { type: Number, default: 0, min: 0 },
    profesor: { type: String, trim: true },
    horario: {
      dia: {
        type: String,
        required: true,
        enum: ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"],
      },
      turno: {
        type: String,
        required: true,
        enum: ["MAÑANA","TARDE","NOCHE"],
      },
    },
    asignacion: {
      aula_id: { type: Schema.Types.ObjectId, ref: "Aula", default: null },
      fecha_asignacion: { type: Date, default: null },
    },
    materia_ids: {
      type: [{ type: Schema.Types.ObjectId, ref: "Materia", required: true }],
      validate: {
        validator: (arr: unknown[]) => Array.isArray(arr) && arr.length > 0,
        message: "Debe haber al menos una materia asignada.",
      },
    },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Índices (mismos criterios):
ComisionSchema.index(
  { "asignacion.aula_id": 1, "horario.dia": 1, "horario.turno": 1, anio_dictado: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null, "asignacion.aula_id": { $exists: true, $ne: null } } }
);

ComisionSchema.index({ anio_dictado: 1, "horario.dia": 1, "horario.turno": 1 });

// Si querés rapidez para buscar por la primera materia (que usa el frontend):
ComisionSchema.index({ "materia_ids.0": 1, anio_dictado: 1 });

export default mongoose.models.Comision ||
  mongoose.model<IComision>("Comision", ComisionSchema);
