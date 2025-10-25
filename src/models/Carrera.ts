import mongoose, { Schema, Document } from 'mongoose';

export interface ICarrera extends Document {
  nombre_carrera: string;
}

const CarreraSchema: Schema = new Schema({
  nombre_carrera: { type: String, required: true, unique: true },
});

export default mongoose.models.Carrera || mongoose.model<ICarrera>('Carrera', CarreraSchema);
