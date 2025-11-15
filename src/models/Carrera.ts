import mongoose, { Schema, Document } from "mongoose";

export interface ICarrera extends Document {
  codigo_carrera: string;
  nombre_carrera: string;
  anios: number;
  sede_ids: mongoose.Types.ObjectId[]; // Sedes donde se dicta la carrera
}

const CarreraSchema: Schema = new Schema({
  codigo_carrera: { type: String, required: true, unique: true },
  nombre_carrera: { type: String, required: true, unique: true },
  anios: { type: Number, required: true }, // Cantidad de años de la carrera
  sede_ids: [{ type: Schema.Types.ObjectId, ref: "Sede" }], // Varias sedes
});

export default mongoose.models.Carrera ||
  mongoose.model<ICarrera>("Carrera", CarreraSchema);
