import { createList, deleteList, getAllLists, updateList } from "../controllers/listController";
import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/:eventoId',authMiddleware, getAllLists)
router.post('/', authMiddleware, createList)
router.delete('/:listId', authMiddleware, deleteList)
router.put('/:id',authMiddleware, updateList)

export default router;