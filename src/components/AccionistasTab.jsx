import { useState } from "react";
import { FaSearch, FaCalendarAlt, FaFileExcel, FaDollarSign, FaChartBar, FaFilter, FaUser, FaCalculator, FaCalendar, FaSortUp, FaSortDown } from "react-icons/fa";
import Paginacion from "./Paginacion";

const AccionistasTab = ({ 
  searchTerm,
  setSearchTerm,
  selectedYear,
  setSelectedYear,
  exportandoExcel,
  exportarAExcel,
  filteredAccionistas,
  multasPorAnio,
  pagosDiariosData,
  anios,
  anioInicio,
  anioFin,
  sortConfigAccionistas,
  handleSortAccionistas,
  obtenerAccionistasPaginaActual,
  calcularTotalMultas,
  calcularTotalMultasAccionista,
  paginaActualAccionistas,
  setPaginaActualAccionistas,
  totalPaginasAccionistas,
  itemsPorPaginaAccionistas,
  setItemsPorPaginaAccionistas,
  totalItems,
  obtenerAccionistaPorId,
  totalAccionistas
}) => {
  const [itemsPorPagina, setItemsPorPagina] = useState(10);

  // Calcular monto real de pagos por accionista y año
  const calcularMontoRealPorAnio = (accionistaId, anio) => {
    if (anio === "Todos") {
      return pagosDiariosData
        .filter(pago => pago.accionistaId === accionistaId)
        .reduce((sum, pago) => sum + pago.monto, 0);
    }
    return pagosDiariosData
      .filter(pago => pago.accionistaId === accionistaId && pago.fechaPago && pago.fechaPago.includes(anio))
      .reduce((sum, pago) => sum + pago.monto, 0);
  };

  // Calcular total real de todos los años para un accionista
  const calcularTotalRealAccionista = (accionistaId) => {
    return pagosDiariosData
      .filter(pago => pago.accionistaId === accionistaId)
      .reduce((sum, pago) => sum + pago.monto, 0);
  };

  // Calcular total del año seleccionado
  const calcularTotalAnioSeleccionado = () => {
    if (selectedYear === "Todos") {
      return pagosDiariosData.reduce((sum, pago) => sum + pago.monto, 0);
    }
    return pagosDiariosData
      .filter(pago => pago.fechaPago && pago.fechaPago.includes(selectedYear))
      .reduce((sum, pago) => sum + pago.monto, 0);
  };

  const calcularPromedioMultas = () => {
    const total = calcularTotalAnioSeleccionado();
    return total > 0 ? Math.round(total / filteredAccionistas.length) : 0;
  };

  return (
    <>
      <div className="bg-aneupi-primary text-white p-7 border-b border-aneupi-primary-dark">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-3">Registro de Multas Anuales - ANEUPI</h2>
            <p className="text-white/80">Control de multas por año ({anioInicio}-{anioFin}) - {totalAccionistas} accionistas principales</p>
          </div>
          <div className="flex items-center gap-5">
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="input-aneupi appearance-none px-9 py-2.5"
              >
                <option value="Todos" className="text-aneupi-primary">Todos los años</option>
                {anios.map(anio => (
                  <option key={anio} value={anio} className="text-aneupi-primary">
                    {anio}
                  </option>
                ))}
              </select>
              <FaCalendarAlt className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white" />
            </div>
            <button
              onClick={() => exportarAExcel("accionistas")}
              disabled={exportandoExcel}
              className="btn-aneupi-secondary flex items-center gap-2"
            >
              <FaFileExcel /> Exportar
            </button>
          </div>
        </div>

        <div className="relative max-w-md">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <FaSearch className="text-white/60" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar accionista por nombre, código o email..."
            className="input-aneupi w-full pl-12 pr-10 py-3.5 placeholder-white/60"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="tablas">
        {/* <table class="w-full h-full border-2 border-[#0D4367]" ></table> */}
        <table className="table-aneupi">
          <thead className="bg-aneupi-bg-tertiary">
            <tr>
              <th className="text-aneupi-primary">
                <button 
                  onClick={() => handleSortAccionistas('id')}
                  className="flex items-center gap-2 hover:text-aneupi-primary-dark transition-colors"
                >
                  N°
                  {sortConfigAccionistas.key === 'id' && (
                    sortConfigAccionistas.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                  )}
                </button>
              </th>
              <th className="text-aneupi-primary">
                <button 
                  onClick={() => handleSortAccionistas('nombre')}
                  className="flex items-center gap-2 hover:text-aneupi-primary-dark transition-colors"
                >
                  Accionistas
                  {sortConfigAccionistas.key === 'nombre' && (
                    sortConfigAccionistas.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                  )}
                </button>
              </th>
              {anios.map(anio => (
                <th key={anio} className="text-center text-aneupi-primary">
                  {anio}
                  {anio === selectedYear && (
                    <span className="ml-2 inline-block w-2 h-2 bg-aneupi-secondary rounded-full"></span>
                  )}
                </th>
              ))}
              <th className="text-center text-aneupi-primary">
                {selectedYear === "Todos" ? "Total Multas" : `Total ${selectedYear}`}
              </th>
            </tr>
          </thead>
          <tbody>
            {obtenerAccionistasPaginaActual().map((accionista, index) => {
              const totalMultas = selectedYear === "Todos" 
                ? calcularTotalRealAccionista(accionista.id)
                : calcularMontoRealPorAnio(accionista.id, selectedYear);
              
              return (
                <tr 
                  key={accionista.id} 
                  className={`hover:bg-aneupi-bg-tertiary transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-aneupi-bg-tertiary'}`}
                >
                  <td>
                    <div className="font-bold text-aneupi-primary text-lg">{accionista.id}</div>
                  </td>
                  <td>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-aneupi-primary rounded-full flex items-center justify-center text-white font-bold shadow-sm border border-aneupi-primary-dark">
                        {accionista.nombre.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-aneupi-primary">{accionista.nombre}</p>
                        <p className="text-sm text-aneupi-text-muted mt-1">{accionista.codigo}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded border ${
                            accionista.estado === "Activo" 
                              ? 'bg-green-100 text-green-700 border-green-200' 
                              : accionista.estado === "Suspendido"
                              ? 'bg-red-100 text-red-700 border-red-200'
                              : 'bg-gray-100 text-gray-700 border-gray-200'
                          }`}>
                            {accionista.estado}
                          </span>
                        </div>
                        <p className="text-xs text-aneupi-text-muted mt-1">
                          <FaCalendar className="inline mr-1" />
                          Ingreso: {accionista.fechaIngreso}
                        </p>
                      </div>
                    </div>
                  </td>
                  {anios.map(anio => {
                    const multa = calcularMontoRealPorAnio(accionista.id, anio);
                    return (
                      <td className="text-center">
                        <div className="badge-aneupi">
                          <FaDollarSign className="text-xs" />
                          <span className="font-medium">${multa.toLocaleString()}</span>
                        </div>
                      </td>
                    );
                  })}
                  <td className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-aneupi-primary text-white rounded-full shadow-sm border border-aneupi-primary-dark">
                        <FaCalculator className="text-xs" />
                        <span className="font-bold text-lg">${totalMultas.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-aneupi-text-muted mt-1">
                        {selectedYear === "Todos" ? `Suma total ${anioInicio}-${anioFin}` : `Total ${selectedYear}`}
                      </p>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Paginacion
        tipo="accionistas"
        paginaActual={paginaActualAccionistas}
        setPaginaActual={setPaginaActualAccionistas}
        totalPaginas={totalPaginasAccionistas}
        itemsPorPagina={itemsPorPaginaAccionistas}
        setItemsPorPagina={setItemsPorPaginaAccionistas}
        totalItems={totalItems}
        itemsPaginaActual={obtenerAccionistasPaginaActual().length}
      />

      <div className="bg-aneupi-bg-tertiary p-7 border-t border-aneupi-border-light">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          <div className="card-aneupi">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-aneupi-primary">Total {selectedYear}</h3>
              <FaDollarSign className="text-aneupi-primary" />
            </div>
            <p className="text-2xl font-bold text-aneupi-primary">
              ${calcularTotalAnioSeleccionado().toLocaleString()}
            </p>
            <p className="text-sm text-aneupi-text-muted mt-2">Entre {totalAccionistas} accionistas</p>
          </div>
          <div className="card-aneupi">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-aneupi-primary">Promedio por Accionista</h3>
              <FaChartBar className="text-aneupi-primary" />
            </div>
            <p className="text-2xl font-bold text-aneupi-primary">
              ${calcularPromedioMultas().toLocaleString()}
            </p>
            <p className="text-sm text-aneupi-text-muted mt-2">Multa promedio</p>
          </div>
          <div className="card-aneupi">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-aneupi-primary">Resultados filtrados</h3>
              <FaFilter className="text-aneupi-primary" />
            </div>
            <p className="text-2xl font-bold text-aneupi-primary">
              {filteredAccionistas.length} de {totalAccionistas}
            </p>
            <p className="text-sm text-aneupi-text-muted mt-2">Accionistas encontrados</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccionistasTab;