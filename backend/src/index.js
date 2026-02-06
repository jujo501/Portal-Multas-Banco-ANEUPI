import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import accionistaRoutes from './routes/accionista.routes.js'
import pagoRoutes from "./routes/pago.routes.js" 

const app = express()
const PORT = 3000

// Configuraciones
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// --- RUTAS ---
app.use("/api/pagos", pagoRoutes);      
app.use('/api', accionistaRoutes);      

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor Backend corriendo en http://localhost:${PORT}`)
  console.log(`💳 API Pagos lista en http://localhost:${PORT}/api/pagos`)
})