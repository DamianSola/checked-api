import express from 'express';
import { Request, Response} from 'express';


const router = express.Router();


router.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "El backend está escuchando correctamente" });
});

export default router;