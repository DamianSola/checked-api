"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eliminarEvento = exports.editarEvento = exports.obtenerPorId = exports.crearEvento = exports.obtenerEventos = void 0;
const Event_1 = __importDefault(require("../models/Event")); // Asegúrate de que la ruta al modelo es correcta
const List_1 = __importDefault(require("../models/List"));
const Guest_1 = __importDefault(require("../models/Guest"));
// Controlador para obtener los eventos del usuario autenticado
const obtenerEventos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const eventos = yield Event_1.default.find({ creadoPor: id });
        res.status(200).json(eventos);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los eventos' });
    }
});
exports.obtenerEventos = obtenerEventos;
const crearEvento = (req, res, next) => {
    try {
        const { nombre, fecha, lugar, creadoPor } = req.body;
        const evento = new Event_1.default({ nombre, fecha, lugar, creadoPor });
        evento.save();
        res.status(201).json({ message: 'Evento creado con exito' });
    }
    catch (err) {
        return res.status(500).json({ message: 'Error al crear el evento' });
    }
};
exports.crearEvento = crearEvento;
const obtenerPorId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const evento = yield Event_1.default.findById(id);
        if (!evento) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }
        res.status(200).json(evento);
    }
    catch (err) {
        next(err);
    }
});
exports.obtenerPorId = obtenerPorId;
const editarEvento = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const dataNueva = req.body;
        // Filtrar las propiedades con valores nulos, indefinidos o strings vacíos
        const dataFiltrada = Object.fromEntries(Object.entries(dataNueva).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
        const eventoEditado = yield Event_1.default.findByIdAndUpdate(id, dataFiltrada, { new: true });
        if (!eventoEditado) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }
        res.status(200).json({ message: 'Cambios guardados', eventoEditado });
    }
    catch (err) {
        next(err);
    }
});
exports.editarEvento = editarEvento;
const eliminarEvento = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Eliminar el evento
        const eventoEliminado = yield Event_1.default.findByIdAndDelete(id);
        if (!eventoEliminado) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }
        // Eliminar las listas relacionadas con el evento
        yield List_1.default.deleteMany({ eventoId: id });
        // Eliminar los invitados relacionados con el evento
        yield Guest_1.default.deleteMany({ eventoId: id });
        res.status(200).json({ message: 'Evento y datos relacionados eliminados exitosamente' });
    }
    catch (err) {
        next(err);
    }
});
exports.eliminarEvento = eliminarEvento;
