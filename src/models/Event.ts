import { Schema, model, Document } from 'mongoose';
import List from './List';

interface IEvent extends Document {
  nombre: string;
  fecha: Date;
  lugar: string;
  creadoPor: Schema.Types.ObjectId; // Referencia al usuario que lo creó
  listas: Schema.Types.ObjectId;
}

const eventSchema = new Schema<IEvent>({
  nombre: { type: String, required: true },
  fecha: { type: Date, required: true },
  lugar: { type: String, required: true },
  creadoPor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  listas: [{
    type: Schema.Types.ObjectId,
    ref: 'List'
  }]
}, { timestamps: true });

export default model<IEvent>('Event', eventSchema);
