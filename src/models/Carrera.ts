import mongoose, { Schema, Document } from 'mongoose';
import Sede from "./Sede";

export interface ICarrera extends Document {
  codigo_carrera: string;
  nombre_carrera: string;
  anios: number;
  sede_ids: mongoose.Types.ObjectId[]; // Sedes donde se dicta la carrera
}

const CarreraSchema: Schema = new Schema(
  {
    codigo_carrera: {
      type: String,
      required: true,
      unique: true
    },
    nombre_carrera: {
      type: String,
      required: true,
      unique: true, // para evitar duplicados
      trim: true,
    },
    anios: {
      type: Number,
      required: true,
      min: 1,
      max: 10, // opcional, depende como manejemos la lógica
    },
    sede_ids: [{ type: Schema.Types.ObjectId, ref: "Sede" }], // Varias sedes
    deletedAt: {
      type: Date,
      default: null, // borrado lógico (en vez de eliminar por completo)
    },
  },
  { timestamps: true } // createdAt y updatedAt automáticos
);

CarreraSchema.index(
  { nombre_carrera: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } }
);

CarreraSchema.index(
  { codigo_carrera: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } }
);


export default mongoose.models.Carrera || mongoose.model<ICarrera>('Carrera', CarreraSchema);
