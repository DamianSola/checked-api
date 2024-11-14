import express, { Application } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import morgan from 'morgan';
import cors from 'cors';


// Importar rutas
import eventRoutes from './routes/eventRoutes';
import userRoutes from './routes/userRoutes';
import listRoutes from './routes/listRoutes';
import guestRoutes from './routes/guestRoutes';

dotenv.config();

const corsOptions = {
  origin: process.env.CORS_URL, // Reemplaza con la URL de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Conectar a la base de datos
connectDB();

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));
// Rutas
app.use('/events', eventRoutes);
app.use('/users', userRoutes);
app.use('/lists', listRoutes)
app.use('/guest', guestRoutes)

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
