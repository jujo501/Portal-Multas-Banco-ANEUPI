import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// Importación de Rutas
import accionistaRoutes from './routes/accionista.routes.js';
import pagoRoutes from "./routes/pago.routes.js"; 
import authRoutes from './routes/auth.routes.js';

// Configuración para usar directorios en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// --- MIDDLEWARES ---
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- RUTAS API ---
app.use("/api/pagos", pagoRoutes);       
app.use('/api/accionistas', accionistaRoutes);
app.use("/api/auth", authRoutes);

// --- ARRANQUE DEL SERVIDOR ---
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});