import mongoose, { Schema, Document } from 'mongoose';

export interface IAula extends Document {
  nombre_o_numero: string;
  capacidad: number;
  tipo_aula: string;
  edificio_id: mongoose.Types.ObjectId;
}

const AulaSchema: Schema = new Schema({
  nombre_o_numero: { type: String, required: true },
  capacidad: { type: Number, required: true },
  tipo_aula: { type: String, required: false },
  edificio_id: { type: Schema.Types.ObjectId, ref: 'Edificio', required: true },
});

export default mongoose.models.Aula || mongoose.model<IAula>('Aula', AulaSchema);
