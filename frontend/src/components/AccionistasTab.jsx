import { FaSearch, FaCalendarAlt, FaFileExcel, FaUser, FaMoneyBillWave, FaChartPie } from "react-icons/fa";
import Paginacion from "./Paginacion";

const AccionistasTab = ({ 
  searchTerm = "",
  setSearchTerm,
  selectedYear,
  setSelectedYear,
  exportandoExcel,
  exportarAExcel,
  
  // Datos Reales 
  filteredAccionistas = [], 
  pagosDiariosData = [],    
  anios = [],
  
  // Paginación
  obtenerAccionistasPaginaActual,
  paginaActualAccionistas,
  setPaginaActualAccionistas,
  totalPaginasAccionistas,
  itemsPorPaginaAccionistas,
  setItemsPorPaginaAccionistas,
  totalItems,
  totalAccionistas
}) => {

  // --- CÁLCULOS DE NEGOCIO ---

  // 1. Calcular cuánto pagó un accionista en un año específico
  const calcularPagoPorAnio = (accionistaId, anio) => {
    if (!pagosDiariosData || pagosDiariosData.length === 0) return 0;

    // Filtramos pagos de este usuario
    const pagosUsuario = pagosDiariosData.filter(p => p.accionistaId === accionistaId);

    if (anio === "Todos") {
        return pagosUsuario.reduce((sum, p) => sum + Number(p.monto || 0), 0);
    } else {
        return pagosUsuario
            .filter(p => (p.fechaIngresoMulta || "").includes(anio.toString()))
            .reduce((sum, p) => sum + Number(p.monto || 0), 0);
    }
  };

  // 2. Calcular total global del año seleccionado (para las tarjetas de abajo)
  const calcularTotalAnioSeleccionado = () => {
    let pagosFiltrados = pagosDiariosData;
    
    // Si hay búsqueda por nombre, sumamos solo de los usuarios visibles
    if (searchTerm) {
        const idsVisibles = filteredAccionistas.map(a => a.id);
        pagosFiltrados = pagosFiltrados.filter(p => idsVisibles.includes(p.accionistaId));
    }

    if (selectedYear !== "Todos") {
        pagosFiltrados = pagosFiltrados.filter(p => (p.fechaIngresoMulta || "").includes(selectedYear));
    }
    
    return pagosFiltrados.reduce((sum, p) => sum + Number(p.monto || 0), 0);
  };

  // 3. Calcular Promedio
  const calcularPromedio = () => {
    const total = calcularTotalAnioSeleccionado();
    const divisor = filteredAccionistas.length || 1;
    return total / divisor;
  };

  // Obtenemos los usuarios a mostrar en esta página
  const accionistasVisibles = obtenerAccionistasPaginaActual();

  return (
    <>
      <div className="bg-aneupi-primary text-white p-7 border-b border-aneupi-primary-dark">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-3">Registro de Multas Anuales</h2>
            <p className="text-white/80 flex items-center gap-2">
               <FaUser className="text-sm"/> Control de multas de {totalAccionistas} accionistas registrados
            </p>
          </div>
          
          <div className="flex items-center gap-5">
            {/* Filtro de Año */}
            <div className="relative">
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)} 
                className="bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:bg-white/20 transition-colors cursor-pointer appearance-none"
              >
                <option value="Todos" className="text-black">Todos los años</option>
                {(anios || []).map(anio => <option key={anio} value={anio} className="text-black">{anio}</option>)}
              </select>
              <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/70" />
            </div>

            {/* Botón Exportar */}
            <button 
                onClick={() => exportarAExcel("accionistas")} 
                disabled={exportandoExcel}
                className="flex items-center gap-2 px-4 py-2.5 bg-white text-aneupi-primary font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-sm disabled:opacity-70"
            >
              <FaFileExcel /> {exportandoExcel ? "Exportando..." : "Exportar"}
            </button>
          </div>
        </div>

        {/* Barra de Búsqueda */}
        <div className="relative max-w-md">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-aneupi-primary/60" />
          <input 
            type="text" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            placeholder="Buscar por nombre o código..." 
            className="w-full pl-12 pr-4 py-3.5 rounded-xl text-gray-800 placeholder-gray-500 bg-white focus:outline-none focus:ring-4 focus:ring-white/20 shadow-lg" 
          />
        </div>
      </div>

      {/* TABLA PRINCIPAL */}
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full border-collapse">
          <thead className="bg-aneupi-bg-tertiary">
            <tr>
              <th className="py-4 px-6 text-left text-aneupi-primary font-bold border-b-2 border-aneupi-primary/20 w-20">ID</th>
              <th className="py-4 px-6 text-left text-aneupi-primary font-bold border-b-2 border-aneupi-primary/20">Accionista</th>
              {/* Columnas Dinámicas de Años */}
              {(anios || []).slice(0, 5).map(anio => (
                  <th key={anio} className="py-4 px-6 text-center text-aneupi-primary font-bold border-b-2 border-aneupi-primary/20">
                    {anio}
                  </th>
              ))}
              <th className="py-4 px-6 text-center text-aneupi-primary font-bold border-b-2 border-aneupi-primary/20 bg-aneupi-primary/5">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {accionistasVisibles.length > 0 ? (
                accionistasVisibles.map((accionista, index) => {
                  const totalHistorico = calcularPagoPorAnio(accionista.id, "Todos");
                  
                  return (
                    <tr key={accionista.id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      {/* ID */}
                      <td className="py-4 px-6 border-b border-gray-100 font-mono text-gray-500 text-sm">#{accionista.id}</td>
                      
                      {/* Nombre y Código */}
                      <td className="py-4 px-6 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-aneupi-primary to-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                            {(accionista.nombre || "U").charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{accionista.nombre || "Sin nombre"}</p>
                            <p className="text-xs text-gray-500 font-mono bg-gray-100 px-1.5 py-0.5 rounded inline-block">
                                {accionista.codigo || "S/C"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Montos por Año */}
                      {(anios || []).slice(0, 5).map(anio => {
                        const monto = calcularPagoPorAnio(accionista.id, anio);
                        return (
                          <td key={anio} className="py-4 px-6 border-b border-gray-100 text-center">
                            {monto > 0 ? (
                                <span className="font-medium text-gray-700">${monto.toLocaleString()}</span>
                            ) : (
                                <span className="text-gray-300">-</span>
                            )}
                          </td>
                        );
                      })}

                      {/* Total Histórico */}
                      <td className="py-4 px-6 border-b border-gray-100 text-center bg-gray-50/30">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-aneupi-primary text-white text-sm font-bold shadow-sm">
                          ${totalHistorico.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  );
                })
            ) : (
                <tr>
                    <td colSpan={10} className="py-12 text-center text-gray-400">
                        No se encontraron accionistas con ese criterio.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <Paginacion
        tipo="accionistas"
        paginaActual={paginaActualAccionistas}
        setPaginaActual={setPaginaActualAccionistas}
        totalPaginas={totalPaginasAccionistas}
        itemsPorPagina={itemsPorPaginaAccionistas}
        setItemsPorPagina={setItemsPorPaginaAccionistas}
        totalItems={totalItems}
        itemsPaginaActual={accionistasVisibles.length}
      />

      {/* Tarjetas de Resumen (Footer) */}
      <div className="bg-gray-50 p-8 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-aneupi-primary rounded-lg text-xl"><FaMoneyBillWave/></div>
          <div>
             <h3 className="text-sm font-medium text-gray-500 uppercase">Total Recaudado ({selectedYear})</h3>
             <p className="text-2xl font-bold text-gray-800">${calcularTotalAnioSeleccionado().toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg text-xl"><FaChartPie/></div>
          <div>
             <h3 className="text-sm font-medium text-gray-500 uppercase">Promedio por Socio</h3>
             <p className="text-2xl font-bold text-gray-800">${calcularPromedio().toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg text-xl"><FaUser/></div>
          <div>
             <h3 className="text-sm font-medium text-gray-500 uppercase">Socios Filtrados</h3>
             <p className="text-2xl font-bold text-gray-800">{filteredAccionistas.length} <span className="text-sm text-gray-400 font-normal">/ {totalAccionistas}</span></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccionistasTab;