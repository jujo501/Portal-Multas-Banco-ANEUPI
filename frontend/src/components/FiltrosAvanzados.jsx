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
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-aneupi-border-light">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-aneupi-primary flex items-center gap-2">
          <FaFilter className="text-aneupi-primary" />
          Filtros
        </h3>
        <button
          onClick={() => setFiltroAvanzado(false)}
          className="text-aneupi-text-muted hover:text-aneupi-primary"
        >
          <FaTimes className="text-xl" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-aneupi-primary mb-2">
            Estado del Accionista
          </label>
          <select
            onChange={(e) => {
              if (e.target.value) {
                agregarFiltro("estado", e.target.value);
                e.target.value = "";
              }
            }}
            className="w-full px-3 py-2 border border-aneupi-border-light rounded-lg focus:border-aneupi-primary focus:ring-1 focus:ring-aneupi-primary"
          >
            <option value="">Seleccionar estado...</option>
            <option value="Activo">Activo</option>
            <option value="Suspendido">Suspendido</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
      </div>
      
      {/* Filtros activos */}
      {filtrosActivos.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-aneupi-primary mb-2">Filtros Aplicados</h4>
          <div className="flex flex-wrap gap-2">
            {filtrosActivos.map((filtro, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1 bg-aneupi-secondary/20 text-aneupi-primary rounded-full border border-aneupi-secondary/50"
              >
                <span className="text-sm">{filtro.tipo}: {filtro.valor}</span>
                <button
                  onClick={() => removerFiltro(index)}
                  className="text-aneupi-primary hover:text-aneupi-primary-dark"
                >
                  <FaTimes className="text-xs" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex gap-3 mt-6">
        <button
          onClick={limpiarFiltros}
          className="px-4 py-2 border border-aneupi-border-light text-aneupi-text-secondary rounded-lg hover:bg-aneupi-bg-tertiary font-medium"
        >
          Limpiar Filtros
        </button>
        <button
          onClick={() => setFiltroAvanzado(false)}
          className="flex-1 px-4 py-2 bg-aneupi-primary text-white rounded-lg hover:bg-aneupi-primary-dark font-medium"
        >
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
};

export default FiltrosAvanzados;