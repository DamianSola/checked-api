import { addGuest, deleteGuest, getGuestByList, getGuestByEvent,findByDni, CheckGuest } from '../controllers/guestController';
import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', addGuest)
router.get('/:listaId' , getGuestByList)
router.get('/guestEvent/:eventoId' , getGuestByEvent)
router.delete('/:guestId', deleteGuest )
router.get('/:eventoId/:dni', findByDni)
router.put('/:_id', CheckGuest)
router.use(authMiddleware);

export default router;