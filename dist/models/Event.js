"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const eventSchema = new mongoose_1.Schema({
    nombre: { type: String, required: true },
    fecha: { type: Date, required: true },
    lugar: { type: String, required: true },
    creadoPor: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    listas: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'List'
        }]
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Event', eventSchema);
