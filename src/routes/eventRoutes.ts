import express from 'express';
import { obtenerEventos, crearEvento, obtenerPorId, editarEvento, eliminarEvento} from '../controllers/eventController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// Ruta para obtener los eventos del usuario autenticado
router.get('/:id', authMiddleware, obtenerEventos);
router.post('/', crearEvento, authMiddleware);
router.get('/event/:id', obtenerPorId,authMiddleware);
router.delete('/event/:id', eliminarEvento,authMiddleware)
router.put('/event/:id', editarEvento,authMiddleware);

export default router;