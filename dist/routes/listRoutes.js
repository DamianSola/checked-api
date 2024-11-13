"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const listController_1 = require("../controllers/listController");
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get('/:eventoId', authMiddleware_1.authMiddleware, listController_1.getAllLists);
router.post('/', authMiddleware_1.authMiddleware, listController_1.createList);
router.delete('/:listId', authMiddleware_1.authMiddleware, listController_1.deleteList);
router.put('/:id', authMiddleware_1.authMiddleware, listController_1.updateList);
exports.default = router;
