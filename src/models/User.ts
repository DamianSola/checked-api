import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
  nombre: string;
  email: string;
  password: string;
  rol: 'admin' | 'supervisor';
}

const userSchema = new Schema<IUser>({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['admin', 'supervisor'], default: 'supervisor' }
}, { timestamps: true });

export default model<IUser>('User', userSchema);
