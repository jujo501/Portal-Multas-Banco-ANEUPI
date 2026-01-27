# Sistema de Variables CSS Dinámicas - Portal ANEUPI

## Descripción
Este sistema permite controlar toda la paleta de colores y propiedades de diseño desde `index.css` de forma dinámica, facilitando el cambio de temas y mantenimiento del diseño.

## Variables Disponibles

### Colores Principales
```css
--aneupi-primary: 0, 51, 95;           /* Azul marino principal */
--aneupi-primary-dark: 0, 41, 76;      /* Azul marino oscuro */
--aneupi-secondary: 148, 163, 184;     /* Gris plateado */
--aneupi-secondary-dark: 100, 116, 139; /* Gris plateado oscuro */
```

### Colores de Estado
```css
--aneupi-success: 34, 197, 94;         /* Verde éxito */
--aneupi-warning: 245, 158, 11;        /* Naranja advertencia */
--aneupi-error: 239, 68, 68;           /* Rojo error */
--aneupi-info: 59, 130, 246;           /* Azul información */
```

### Espaciado
```css
--aneupi-spacing-xs: 0.25rem;          /* 4px */
--aneupi-spacing-sm: 0.5rem;           /* 8px */
--aneupi-spacing-md: 1rem;             /* 16px */
--aneupi-spacing-lg: 1.5rem;           /* 24px */
--aneupi-spacing-xl: 2rem;             /* 32px */
--aneupi-spacing-2xl: 3rem;            /* 48px */
```

## Clases Utilitarias

### Colores de Fondo
- `.bg-aneupi-primary` - Fondo azul marino principal
- `.bg-aneupi-secondary` - Fondo gris plateado
- `.bg-aneupi-success` - Fondo verde éxito
- `.bg-aneupi-warning` - Fondo naranja advertencia
- `.bg-aneupi-error` - Fondo rojo error

### Colores de Texto
- `.text-aneupi-primary` - Texto azul marino
- `.text-aneupi-secondary` - Texto gris plateado
- `.text-aneupi-text-primary` - Texto principal
- `.text-aneupi-text-secondary` - Texto secundario
- `.text-aneupi-text-muted` - Texto deshabilitado

### Componentes Predefinidos
- `.btn-aneupi-primary` - Botón principal
- `.btn-aneupi-secondary` - Botón secundario
- `.card-aneupi` - Tarjeta con estilos ANEUPI
- `.badge-aneupi` - Badge con estilos ANEUPI
- `.input-aneupi` - Input con estilos ANEUPI
- `.table-aneupi` - Tabla con estilos ANEUPI

## Temas Disponibles

### Tema por Defecto (ANEUPI Clásico)
Colores azul marino y gris plateado corporativos.

### Tema Oscuro (`.theme-dark`)
```css
.theme-dark {
  --aneupi-bg-primary: 15, 23, 42;
  --aneupi-bg-secondary: 30, 41, 59;
  --aneupi-text-primary: 248, 250, 252;
}
```

### Tema Verde (`.theme-green`)
```css
.theme-green {
  --aneupi-primary: 5, 150, 105;
  --aneupi-secondary: 34, 197, 94;
}
```

### Tema Púrpura (`.theme-purple`)
```css
.theme-purple {
  --aneupi-primary: 124, 58, 237;
  --aneupi-secondary: 147, 51, 234;
}
```

## Cómo Usar

### 1. Migrar Colores Hardcodeados
**Antes:**
```jsx
<div className="bg-[rgb(0,51,95)] text-white">
```

**Después:**
```jsx
<div className="bg-aneupi-primary text-white">
```

### 2. Usar Variables CSS Directamente
```jsx
<div style={{ backgroundColor: 'rgb(var(--aneupi-primary))' }}>
```

### 3. Crear Componentes con Clases Predefinidas
```jsx
<button className="btn-aneupi-primary">
  Botón Principal
</button>

<div className="card-aneupi">
  <h3 className="text-aneupi-primary">Título</h3>
  <p className="text-aneupi-text-secondary">Contenido</p>
</div>
```

### 4. Cambiar Temas Dinámicamente
```jsx
// Cambiar a tema oscuro
document.body.classList.add('theme-dark');

// Cambiar a tema verde
document.body.classList.remove('theme-dark');
document.body.classList.add('theme-green');

// Volver al tema por defecto
document.body.classList.remove('theme-dark', 'theme-green', 'theme-purple');
```

## Ventajas del Sistema

1. **Centralización**: Todos los colores y estilos en un solo lugar
2. **Consistencia**: Garantiza el uso coherente de la paleta de colores
3. **Mantenibilidad**: Fácil actualización de toda la aplicación
4. **Temas Dinámicos**: Cambio de temas sin recargar la página
5. **Escalabilidad**: Fácil agregar nuevos temas y variables
6. **Performance**: Uso eficiente de CSS variables nativas

## Ejemplo de Migración Completa

### Componente Original
```jsx
const Header = () => (
  <div className="bg-[rgb(0,51,95)] text-white p-4 rounded-lg border border-[rgb(0,41,76)]">
    <h1 className="text-2xl font-bold text-[rgb(0,51,95)]">Título</h1>
    <button className="px-4 py-2 bg-[rgb(148,163,184)] hover:bg-[rgb(100,116,139)]">
      Botón
    </button>
  </div>
);
```

### Componente Migrado
```jsx
const Header = () => (
  <div className="bg-aneupi-primary text-white p-4 rounded-lg border-aneupi-primary-dark">
    <h1 className="text-2xl font-bold text-aneupi-primary">Título</h1>
    <button className="btn-aneupi-secondary">
      Botón
    </button>
  </div>
);
```

## Control de Temas con ThemeController

El componente `ThemeController` permite cambiar temas dinámicamente:

```jsx
import ThemeController from './components/ThemeController';

// En tu componente principal
<ThemeController />
```

Este sistema proporciona una base sólida para el manejo dinámico de estilos en toda la aplicación Portal ANEUPI.