import { Schema, model, Document } from 'mongoose';

interface IGuest extends Document {
  nombre: string;
  dni: number;
  estado: 'pendiente' | 'admitido';
  horaIngreso: Date;
  listaId: Schema.Types.ObjectId;
  eventoId: Schema.Types.ObjectId;
}

const guestSchema = new Schema<IGuest>({
  nombre: { type: String, required: true },
  dni: { type: Number, required: true},
  estado: { type: String, enum: ['pendiente', 'admitido'], default: 'pendiente' },
  listaId: { type: Schema.Types.ObjectId, ref: 'List', required: true },
  horaIngreso: { type: Date, default: Date.now },
  eventoId: { type: Schema.Types.ObjectId, ref: 'Event', required: true }
}, { timestamps: true });

// guestSchema.index({ dni: 1, eventoId: 1 });

export default model<IGuest>('Guest', guestSchema);
