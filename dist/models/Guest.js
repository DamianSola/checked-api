"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const guestSchema = new mongoose_1.Schema({
    nombre: { type: String, required: true },
    dni: { type: Number, required: true },
    estado: { type: String, enum: ['pendiente', 'admitido'], default: 'pendiente' },
    listaId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'List', required: true },
    horaIngreso: { type: Date, default: Date.now },
    eventoId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Event', required: true }
}, { timestamps: true });
// Crear un índice compuesto para asegurar que el dni sea único por eventoId
guestSchema.index({ dni: 1, eventoId: 1 }, { unique: true });
exports.default = (0, mongoose_1.model)('Guest', guestSchema);
