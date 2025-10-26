import { AulaRecursos } from "@/lib/Tipos/tipos";
import mongoose, { Schema, Document } from "mongoose";

export interface IAula extends Document {
  nombre_o_numero: string;
  capacidad: number;
  tipo_aula: string;
  edificio_id: mongoose.Types.ObjectId;
  recursos?: string[];
}

const AulaSchema: Schema = new Schema({
  nombre_o_numero: { type: String, required: true },
  capacidad: { type: Number, required: true },
  tipo_aula: { type: String, required: true },
  edificio_id: { type: Schema.Types.ObjectId, ref: "Edificio", required: true },
  recursos: [{ type: String, enum: AulaRecursos, default: [] }],
});

export default mongoose.models.Aula ||
  mongoose.model<IAula>("Aula", AulaSchema);
