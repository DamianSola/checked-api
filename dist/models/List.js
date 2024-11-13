"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const listSchema = new mongoose_1.Schema({
    nombre: { type: String, required: true },
    abierta: { type: Boolean, default: true },
    invitados: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Guest'
        }], // Added a comma here
    eventoId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Event', required: true }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('List', listSchema);
