import { Schema, model, Document } from 'mongoose';

interface IList extends Document {
    nombre: string;
    abierta: boolean;
    invitados: Schema.Types.ObjectId; // Changed to an array of ObjectId
    eventoId: Schema.Types.ObjectId
}

const listSchema = new Schema<IList>({
    nombre: { type: String, required: true },
    abierta: { type: Boolean, default: true },
    invitados: [{ // Corrected to ensure it's an array
        type: Schema.Types.ObjectId,
        ref: 'Guest'
    }], // Added a comma here
    eventoId: { type: Schema.Types.ObjectId, ref: 'Event', required: true}
}, { timestamps: true });

export default model<IList>('List', listSchema);