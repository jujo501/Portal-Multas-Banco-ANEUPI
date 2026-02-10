import { FaSearch, FaCalendarAlt, FaFileExcel, FaUser, FaMoneyBillWave, FaChartPie, FaDatabase } from "react-icons/fa";
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

  // --- CÁLCULOS DE NEGOCIO (INTACTOS) ---

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

  // 2. Calcular total global del año seleccionado
  const calcularTotalAnioSeleccionado = () => {
    let pagosFiltrados = pagosDiariosData;
    
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

  const accionistasVisibles = obtenerAccionistasPaginaActual();

  return (
    <>
      {/* --- ENCABEZADO AZUL OSCURO (REDDISEÑADO CON BUSCADOR INTEGRADO) --- */}
      <div className="bg-aneupi-primary text-white p-7 border-b border-aneupi-primary-dark">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
          
          {/* Título y Descripción */}
          <div>
            <h2 className="text-2xl font-bold mb-3">Registro de Multas Anuales</h2>
            <p className="text-white/80 flex items-center gap-2 text-sm">
               <FaDatabase className="text-sm"/> Control de multas de {totalAccionistas} accionistas registrados
            </p>
          </div>
          
          {/* --- BARRA DE HERRAMIENTAS (Buscador + Filtros + Exportar) --- */}
          <div className="flex flex-col md:flex-row gap-4 items-end md:items-center w-full md:w-auto">
             
             {/* 1. BUSCADOR INTEGRADO (Nuevo diseño) */}
             <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-white/50" />
                </div>
                <input 
                    type="text" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    placeholder="Buscar por nombre o código..." 
                    className="bg-white/20 border border-white/30 text-white text-sm rounded-lg focus:ring-white focus:border-white block w-full pl-10 p-2.5 placeholder-white/60 outline-none transition-all hover:bg-white/30" 
                />
             </div>

             {/* 2. Filtro de Año */}
             <div className="relative">
               <select 
                 value={selectedYear} 
                 onChange={(e) => setSelectedYear(e.target.value)} 
                 className="bg-white/20 border border-white/30 text-white text-sm rounded-lg block w-40 p-2.5 focus:outline-none focus:bg-white/30 cursor-pointer appearance-none"
               >
                 <option value="Todos" className="text-black">Año: Todos</option>
                 {(anios || []).map(anio => <option key={anio} value={anio} className="text-black">{anio}</option>)}
               </select>
               <FaCalendarAlt className="absolute right-3 top-3 text-white/70 text-xs pointer-events-none" />
             </div>

             {/* 3. Botón Exportar */}
             <button 
                onClick={() => exportarAExcel("accionistas")} 
                disabled={exportandoExcel}
                className="flex items-center gap-2 px-4 py-2.5 bg-white text-aneupi-primary text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-sm disabled:opacity-70 whitespace-nowrap"
             >
               <FaFileExcel className="text-green-600" /> {exportandoExcel ? "Exportando..." : "Exportar"}
             </button>
          </div>
        </div>
      </div>

      {/* --- TABLA PRINCIPAL (INTACTA) --- */}
      <div className="overflow-x-auto min-h-[400px] bg-white shadow-sm">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-xs text-aneupi-primary uppercase bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="py-4 px-6 font-bold w-20">ID</th>
              <th className="py-4 px-6 font-bold">Accionista</th>
              {/* Columnas Dinámicas de Años */}
              {(anios || []).slice(0, 5).map(anio => (
                  <th key={anio} className="py-4 px-6 text-center font-bold">
                    {anio}
                  </th>
              ))}
              <th className="py-4 px-6 text-center font-bold bg-aneupi-primary/5">Total</th>
            </tr>
          </thead>
          <tbody>
            {accionistasVisibles.length > 0 ? (
                accionistasVisibles.map((accionista, index) => {
                  const totalHistorico = calcularPagoPorAnio(accionista.id, "Todos");
                  
                  return (
                    <tr key={accionista.id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                      {/* ID */}
                      <td className="py-4 px-6 border-b border-gray-100 font-mono text-gray-500">#{accionista.id}</td>
                      
                      {/* Nombre y Código */}
                      <td className="py-4 px-6 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-aneupi-secondary/10 text-aneupi-primary flex items-center justify-center font-bold text-xs">
                            {(accionista.nombre || "U").charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-sm">{accionista.nombre || "Sin nombre"}</p>
                            <p className="text-[10px] text-gray-500 font-mono bg-gray-100 px-1.5 py-0.5 rounded inline-block mt-0.5">
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
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-aneupi-primary text-white text-xs font-bold">
                          ${totalHistorico.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  );
                })
            ) : (
                <tr>
                    <td colSpan={10} className="py-12 text-center text-gray-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                           <FaUser className="text-4xl opacity-20"/>
                           <p>No se encontraron accionistas con ese criterio.</p>
                        </div>
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
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Total Recaudado ({selectedYear})</h3>
             <p className="text-2xl font-bold text-gray-800 mt-1">${calcularTotalAnioSeleccionado().toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg text-xl"><FaChartPie/></div>
          <div>
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Promedio por Socio</h3>
             <p className="text-2xl font-bold text-gray-800 mt-1">${calcularPromedio().toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg text-xl"><FaUser/></div>
          <div>
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Socios Filtrados</h3>
             <p className="text-2xl font-bold text-gray-800 mt-1">{filteredAccionistas.length} <span className="text-sm text-gray-400 font-normal">/ {totalAccionistas}</span></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccionistasTab;