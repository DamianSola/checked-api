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
exports.updateList = exports.deleteList = exports.getAllLists = exports.createList = void 0;
const List_1 = __importDefault(require("../models/List")); // Asegúrate de que la ruta sea correcta
const Event_1 = __importDefault(require("../models/Event")); // Asegúrate de que la ruta sea correcta
const Guest_1 = __importDefault(require("../models/Guest"));
// Crear una nueva lista
const createList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre, eventoId } = req.body;
    try {
        const newList = new List_1.default({ nombre, abierta: true, eventoId });
        yield newList.save();
        // Agregar la lista al evento
        yield Event_1.default.findByIdAndUpdate(eventoId, { $push: { listas: newList._id } });
        res.status(201).json(newList);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createList = createList;
// Obtener todas las listas de un evento
const getAllLists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventoId } = req.params;
    try {
        // const event = await Event.findById(eventoId).populate('listas');
        const event = yield Event_1.default.findById(eventoId)
            .populate({
            path: 'listas',
            populate: {
                path: 'invitados',
            }
        });
        if (!event)
            return res.status(404).json({ message: 'Evento no encontrado' });
        // console.log(event)
        res.json(event.listas);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getAllLists = getAllLists;
// Eliminar una lista
const deleteList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { listId } = req.params;
    let evento = yield List_1.default.findById(listId);
    let eventoId = evento.eventoId;
    let guestList = yield List_1.default.findById(listId).populate('invitados');
    // Verifica si evento y guestList existen
    if (!evento || !guestList) {
        return res.status(404).json({ message: 'Lista o evento no encontrado' });
    }
    // console.log(eventoId, "holaaa")
    try {
        const deletePromises = guestList.invitados.map((element) => __awaiter(void 0, void 0, void 0, function* () {
            return yield Guest_1.default.findByIdAndDelete(element._id);
        }));
        yield Promise.all(deletePromises);
        // Eliminar la lista
        yield List_1.default.findByIdAndDelete(listId);
        // Actualizar el evento
        yield Event_1.default.findByIdAndUpdate(eventoId, { $pull: { listas: listId } });
        res.json({ message: 'Lista eliminada' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteList = deleteList;
const updateList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Obtenemos el ID de la lista desde los parámetros de la solicitud
    const { nombre, abierta, invitados } = req.body; // Obtenemos los nuevos datos de la lista del cuerpo de la solicitud
    try {
        // Buscamos la lista por ID y la actualizamos
        const updatedList = yield List_1.default.findByIdAndUpdate(id, { nombre, abierta, invitados }, // Los campos que deseas actualizar
        { new: true, runValidators: true } // Devuelve el documento actualizado y aplica validaciones
        );
        // Si no se encuentra la lista, enviamos un error
        if (!updatedList) {
            return res.status(404).json({ message: 'Lista no encontrada' });
        }
        // Enviamos la lista actualizada como respuesta
        res.status(200).json(updatedList);
    }
    catch (error) {
        // En caso de error, enviamos un mensaje de error
        res.status(500).json({ message: 'Error al actualizar la lista', error: error.message });
    }
});
exports.updateList = updateList;
