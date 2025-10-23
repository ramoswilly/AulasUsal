import mongoose, { Schema, Document } from 'mongoose';

export interface IEdificio extends Document {
  nombre: string;
  tipo: string;
  sede_id: mongoose.Types.ObjectId;
}

const EdificioSchema: Schema = new Schema({
  nombre: { type: String, required: true },
  tipo: { type: String, required: false },
  sede_id: { type: Schema.Types.ObjectId, ref: 'Sede', required: true },
});

export default mongoose.models.Edificio || mongoose.model<IEdificio>('Edificio', EdificioSchema);
