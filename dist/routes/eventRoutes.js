"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const eventController_1 = require("../controllers/eventController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// Ruta para obtener los eventos del usuario autenticado
router.get('/:id', authMiddleware_1.authMiddleware, eventController_1.obtenerEventos);
router.post('/', eventController_1.crearEvento, authMiddleware_1.authMiddleware);
router.get('/event/:id', eventController_1.obtenerPorId, authMiddleware_1.authMiddleware);
router.delete('/event/:id', eventController_1.eliminarEvento, authMiddleware_1.authMiddleware);
router.put('/event/:id', eventController_1.editarEvento, authMiddleware_1.authMiddleware);
exports.default = router;
