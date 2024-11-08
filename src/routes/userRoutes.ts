import { Router } from 'express';
import { loginUser, registerUser, updateUser, logout, deleteUser } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logout);
router.put('/:id', authMiddleware, updateUser)
router.delete('/',authMiddleware, deleteUser)

export default router;
