import mongoose, { Schema, Document } from 'mongoose';

export interface ISede extends Document {
  nombre: string;
  direccion: string;
}

const SedeSchema: Schema = new Schema({
  nombre: { type: String, required: true, unique: true },
  direccion: { type: String, required: false },
});

export default mongoose.models.Sede || mongoose.model<ISede>('Sede', SedeSchema);
