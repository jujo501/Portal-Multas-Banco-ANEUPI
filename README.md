# Portal Multas Banco ANEUPI - Proyecto Completo

Sistema integral de gestión de multas y control de accionistas para el Banco ANEUPI.

## 📂 Estructura del Proyecto

```bash
Portal-Multas-Banco-ANEUPI/
├── frontend/          # Aplicación React + Vite (Cliente)
│   ├── src/
│   ├── public/
│   └── package.json
└── backend/           # API REST Node.js + Express + Prisma (Servidor)
    ├── src/
    ├── prisma/
    └── package.json
```

---

## 🚀 Estado del Proyecto

### **Frontend**
**Estado:** ✅ **Completamente Funcional**
- **Tecnología:** React + Vite + Tailwind CSS
- **Características:**
  - Sistema de gestión de accionistas.
  - Interfaz de Usuario profesional (Fuente Georgia, Diseño Institucional).
  - Buscadores integrados y filtros avanzados.
  - Modales para subida de comprobantes y pagos parciales.
  - Tableros de estadísticas con gráficos (Recharts).

### **Backend**
**Estado:** ✅ **Completamente Funcional**
- **Tecnología:** Node.js + Express + PostgreSQL + Prisma ORM
- **Características:**
  - API RESTful completa.
  - Conexión a Base de Datos PostgreSQL mediante Prisma.
  - Lógica de **Abonos Parciales** (Cálculo automático de saldos).
  - Gestión de archivos (Subida de evidencias/comprobantes).
  - Controladores para validación y aprobación de pagos por parte del Administrador.

---

## 🛠️ Tecnologías Utilizadas

| Categoría | Tecnologías |
|-----------|-------------|
| **Frontend** | React 19, Vite, Tailwind CSS, Recharts, React Icons, Axios, Sonner (Toasts) |
| **Backend** | Node.js, Express, Prisma ORM, Multer (Archivos) |
| **Base de Datos** | PostgreSQL |
| **Herramientas** | Git, GitHub, VS Code |

---

## 💻 Instalación y Uso

Sigue estos pasos para levantar el proyecto en tu máquina local. Necesitarás dos terminales abiertas.

### 1. Configuración del Backend (Servidor)

```bash
cd backend

# Instalar dependencias
npm install

# Configurar Base de Datos (Asegúrate de tener PostgreSQL corriendo y tu archivo .env configurado)
npx prisma migrate dev --name init

# Iniciar el Servidor
npm run dev
