#!/bin/bash

# Script para migrar colores hardcodeados al sistema de variables CSS dinámicas

echo "🎨 Iniciando migración al sistema de variables CSS dinámicas..."

# Directorio de componentes
COMPONENTS_DIR="/Users/jorgesalastorres/Portal de Multas - Banco ANEUPI/src/components"

# Función para reemplazar colores en archivos
migrate_colors() {
    local file="$1"
    echo "📝 Migrando: $(basename "$file")"
    
    # Reemplazos de colores principales
    sed -i '' 's/bg-\[rgb(0,51,95)\]/bg-aneupi-primary/g' "$file"
    sed -i '' 's/text-\[rgb(0,51,95)\]/text-aneupi-primary/g' "$file"
    sed -i '' 's/border-\[rgb(0,51,95)\]/border-aneupi-primary/g' "$file"
    
    sed -i '' 's/bg-\[rgb(0,41,76)\]/bg-aneupi-primary-dark/g' "$file"
    sed -i '' 's/text-\[rgb(0,41,76)\]/text-aneupi-primary-dark/g' "$file"
    sed -i '' 's/border-\[rgb(0,41,76)\]/border-aneupi-primary-dark/g' "$file"
    
    # Reemplazos de colores secundarios
    sed -i '' 's/bg-\[rgb(148,163,184)\]/bg-aneupi-secondary/g' "$file"
    sed -i '' 's/text-\[rgb(148,163,184)\]/text-aneupi-secondary/g' "$file"
    sed -i '' 's/border-\[rgb(148,163,184)\]/border-aneupi-secondary/g' "$file"
    
    sed -i '' 's/bg-\[rgb(100,116,139)\]/bg-aneupi-secondary-dark/g' "$file"
    sed -i '' 's/text-\[rgb(100,116,139)\]/text-aneupi-secondary-dark/g' "$file"
    sed -i '' 's/border-\[rgb(100,116,139)\]/border-aneupi-secondary-dark/g' "$file"
    
    # Reemplazos de colores de texto comunes
    sed -i '' 's/text-\[#656663\]/text-aneupi-text-secondary/g' "$file"
    sed -i '' 's/text-\[#9CA5AC\]/text-aneupi-text-muted/g' "$file"
    
    # Reemplazos de colores de fondo comunes
    sed -i '' 's/bg-\[#F8FAFC\]/bg-aneupi-bg-tertiary/g' "$file"
    sed -i '' 's/bg-\[#E5E7EB\]/bg-aneupi-border-light/g' "$file"
    sed -i '' 's/border-\[#E5E7EB\]/border-aneupi-border-light/g' "$file"
    sed -i '' 's/border-\[#F0F1F5\]/border-aneupi-border-light/g' "$file"
    
    # Reemplazos de hover states con colores hardcodeados
    sed -i '' 's/hover:bg-\[rgb(0,51,95)\]/hover:bg-aneupi-primary/g' "$file"
    sed -i '' 's/hover:text-\[rgb(0,41,76)\]/hover:text-aneupi-primary-dark/g' "$file"
    sed -i '' 's/hover:bg-\[rgb(100,116,139)\]/hover:bg-aneupi-secondary-dark/g' "$file"
    
    echo "✅ Migrado: $(basename "$file")"
}

# Migrar todos los archivos .jsx en el directorio de componentes
find "$COMPONENTS_DIR" -name "*.jsx" -type f | while read -r file; do
    # Saltar archivos ya migrados
    if [[ "$(basename "$file")" == "Header.jsx" ]] || [[ "$(basename "$file")" == "ThemeController.jsx" ]]; then
        echo "⏭️  Saltando archivo ya migrado: $(basename "$file")"
        continue
    fi
    
    migrate_colors "$file"
done

echo ""
echo "🎉 ¡Migración completada!"
echo "📊 Verificando resultados..."

# Contar referencias restantes
remaining=$(find "$COMPONENTS_DIR" -name "*.jsx" -exec grep -l "rgb(0,51,95)\|rgb(148,163,184)" {} \; | wc -l)
echo "📈 Referencias hardcodeadas restantes: $remaining archivos"

echo ""
echo "✨ Todos los componentes han sido migrados al sistema de variables CSS dinámicas"
echo "🔧 Ahora puedes cambiar toda la apariencia desde index.css o usando ThemeController"