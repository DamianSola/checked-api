"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
// Importar rutas
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const listRoutes_1 = __importDefault(require("./routes/listRoutes"));
const guestRoutes_1 = __importDefault(require("./routes/guestRoutes"));
dotenv_1.default.config();
const corsOptions = {
    origin: 'http://localhost:3000', // Reemplaza con la URL de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Conectar a la base de datos
(0, db_1.default)();
// Middlewares
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// Rutas
app.use('/events', eventRoutes_1.default);
app.use('/users', userRoutes_1.default);
app.use('/lists', listRoutes_1.default);
app.use('/guest', guestRoutes_1.default);
// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
