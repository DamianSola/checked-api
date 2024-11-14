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
exports.CheckGuest = exports.findByDni = exports.getGuestByEvent = exports.getGuestByList = exports.deleteGuest = exports.addGuest = void 0;
const Guest_1 = __importDefault(require("../models/Guest"));
const List_1 = __importDefault(require("../models/List"));
const Event_1 = __importDefault(require("../models/Event"));
const addGuest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, dni, listaId, eventoId } = req.body;
        let dniNumber = Number(dni);
        const isOpen = yield List_1.default.findById(listaId);
        if (!isOpen.abierta)
            return res.status(403).json({ message: "no se puede agregar, la lista esta cerrada" });
        // const isGuest = await Guest.find({eventoId,dni:dniNumber})
        const existingGuest = yield Guest_1.default.findOne({ dni: dniNumber, eventoId: eventoId });
        if (existingGuest) {
            console.log("existe");
            res.status(209).json({ message: `El dni ${dni} ya esta registrado` });
        }
        else {
            const newGuest = new Guest_1.default({ nombre, dni: dniNumber, listaId, eventoId });
            yield newGuest.save();
            yield List_1.default.findByIdAndUpdate(listaId, { $push: { invitados: newGuest._id } });
            yield Event_1.default.findByIdAndUpdate(eventoId, { $push: { invitados: newGuest._id } });
            res.status(200).json({ message: 'Guest added successfully', guest: newGuest });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding guest', error: error.message });
    }
});
exports.addGuest = addGuest;
const deleteGuest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { guestId } = req.params;
        const guest = yield Guest_1.default.findByIdAndDelete(guestId);
        if (!guest)
            return res.status(404).json({ message: "Guest not found" });
        console.log(guest.listaId, 'lista id');
        yield List_1.default.findByIdAndUpdate(guest.listaId, { $pull: { invitados: guestId } });
        // await List.findByIdAndUpdate(listId, { $pull: { listas: guestId } });
        res.send({ message: "invitado eliminado" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error._message, error: error._message });
    }
});
exports.deleteGuest = deleteGuest;
const getGuestByList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { listaId } = req.params;
    try {
        const guests = yield Guest_1.default.find({ listaId: listaId });
        res.send(guests);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error adding guest', error: error.message });
    }
});
exports.getGuestByList = getGuestByList;
const getGuestByEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventoId } = req.params;
    try {
        const guests = yield Guest_1.default.find({ eventoId: eventoId });
        res.send(guests);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error adding guest', error: error.message });
    }
});
exports.getGuestByEvent = getGuestByEvent;
const findByDni = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventoId, dni } = req.params;
    // const {dni} = req.query;
    let dniNumber = Number(dni);
    try {
        const guest = yield Guest_1.default.find({
            eventoId: eventoId // Asegúrate de que eventoId esté en formato ObjectId
        });
        const isGuest = guest.find(g => g.dni === dniNumber);
        console.log(isGuest);
        if (!isGuest) {
            return res.status(404).json({ message: 'Invitado no encontrado' });
        }
        res.status(200).json({ message: 'Invitado encontrado', guest: isGuest });
    }
    catch (error) {
        res.status(500).json({ message: 'Error en la busqueda del invitado', error: error.message });
    }
});
exports.findByDni = findByDni;
const CheckGuest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    try {
        const guest = yield Guest_1.default.findById(_id);
        if (!guest) {
            return res.status(404).json({ message: 'Invitado no encontrado' });
        }
        // Actualizar el estado y la hora de ingreso
        guest.estado = 'admitido';
        guest.horaIngreso = new Date(); // Asigna la fecha y hora actual
        yield guest.save(); // Guarda los cambios en la base de datos
        res.status(200).json({ message: 'Invitado admitido', guest });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al actualizar el invitado', error: error.message });
    }
});
exports.CheckGuest = CheckGuest;
