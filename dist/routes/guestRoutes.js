"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const guestController_1 = require("../controllers/guestController");
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post('/', guestController_1.addGuest);
router.get('/:listaId', guestController_1.getGuestByList);
router.get('/guestEvent/:eventoId', guestController_1.getGuestByEvent);
router.delete('/:guestId', guestController_1.deleteGuest);
router.get('/:eventoId/:dni', guestController_1.findByDni);
router.put('/:_id', guestController_1.CheckGuest);
router.use(authMiddleware_1.authMiddleware);
exports.default = router;
