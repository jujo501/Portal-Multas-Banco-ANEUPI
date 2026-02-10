import { FaFilter, FaTimes } from "react-icons/fa";

const FiltrosAvanzados = ({ 
  filtroAvanzado,
  setFiltroAvanzado,
  filtrosActivos,
  removerFiltro,
  limpiarFiltros,
  agregarFiltro
}) => {
  
  if (!filtroAvanzado) return null;
  
  // Manejador para cuando se selecciona una opción
  const handleSelectChange = (e) => {
    const valor = e.target.value;
    if (valor) {
      // "estado" es la clave que usaremos para filtrar en la base de datos
      agregarFiltro("estado", valor);
      // Reseteamos el select visualmente
      e.target.value = "";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-aneupi-border-light animate-fade-in-down">
      {/* Cabecera del Filtro */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-aneupi-primary flex items-center gap-2">
          <FaFilter className="text-aneupi-primary" />
          Filtros Avanzados
        </h3>
        <button
          onClick={() => setFiltroAvanzado(false)}
          className="text-aneupi-text-muted hover:text-red-500 transition-colors"
        >
          <FaTimes className="text-xl" />
        </button>
      </div>
      
      {/* Selector de Estado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-aneupi-primary mb-2">
            Estado del Accionista
          </label>
          <select
            onChange={handleSelectChange}
            className="w-full px-3 py-2 border border-aneupi-border-light rounded-lg focus:border-aneupi-primary focus:ring-1 focus:ring-aneupi-primary outline-none cursor-pointer bg-white text-gray-700"
            defaultValue=""
          >
            <option value="" disabled>Seleccionar estado...</option>
            <option value="Activo">Activo</option>
            <option value="Suspendido">Suspendido</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
      </div>
      
      {/* Área de Etiquetas (Chips) de Filtros Activos */}
      {filtrosActivos.length > 0 && (
        <div className="mt-6 border-t border-gray-100 pt-4">
          <h4 className="text-sm font-medium text-aneupi-primary mb-2">Filtros Aplicados:</h4>
          <div className="flex flex-wrap gap-2">
            {filtrosActivos.map((filtro, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1 bg-aneupi-secondary/10 text-aneupi-primary rounded-full border border-aneupi-secondary/30 shadow-sm"
              >
                <span className="text-sm font-semibold capitalize">
                  {filtro.tipo}: <span className="text-gray-600 font-normal">{filtro.valor}</span>
                </span>
                <button
                  onClick={() => removerFiltro(index)}
                  className="text-aneupi-primary hover:text-red-500 transition-colors ml-1"
                  title="Quitar filtro"
                >
                  <FaTimes className="text-xs" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Botones de Acción */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={limpiarFiltros}
          className="px-4 py-2 border border-aneupi-border-light text-gray-600 rounded-lg hover:bg-gray-50 font-medium transition-colors"
        >
          Limpiar Todo
        </button>
        <button
          onClick={() => setFiltroAvanzado(false)}
          className="px-6 py-2 bg-aneupi-primary text-white rounded-lg hover:bg-[#0a3b5a] font-medium shadow-md transition-colors"
        >
          Aplicar y Cerrar
        </button>
      </div>
    </div>
  );
};

export default FiltrosAvanzados;