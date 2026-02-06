import { useState, useEffect } from "react";
import { FaSearch, FaCalendarAlt, FaFileExcel, FaDollarSign, FaChartBar, FaFilter, FaCalculator, FaCalendar, FaSortUp, FaSortDown, FaDatabase } from "react-icons/fa";
import Paginacion from "./Paginacion";

const AccionistasTab = ({ 
  searchTerm = "",
  setSearchTerm,
  selectedYear,
  setSelectedYear,
  exportandoExcel,
  exportarAExcel,
  filteredAccionistas = [],
  pagosDiariosData = [],
  anios = [],
  anioInicio,
  anioFin,
  sortConfigAccionistas,
  handleSortAccionistas,
  obtenerAccionistasPaginaActual,
  calcularTotalMultasAccionista, 
  paginaActualAccionistas,
  setPaginaActualAccionistas,
  totalPaginasAccionistas,
  itemsPorPaginaAccionistas,
  setItemsPorPaginaAccionistas,
  totalItems,
  totalAccionistas
}) => {
  
  const [accionistasReales, setAccionistasReales] = useState([]);
  const [usarDatosReales, setUsarDatosReales] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/api/accionistas')
      .then(res => res.json())
      .then(data => setAccionistasReales(Array.isArray(data) ? data : []))
      .catch(err => console.error(" Error backend:", err));
  }, []);

 
  
  const accionistasRealesFiltrados = (accionistasReales || []).filter(acc => 
    (acc.nombre || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (acc.codigo || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRecaudadoReal = accionistasRealesFiltrados.reduce((total, acc) => {
    const suma = acc.pagos ? acc.pagos.reduce((s, p) => s + Number(p.monto || 0), 0) : 0;
    return total + suma;
  }, 0);

  const promedioReal = accionistasRealesFiltrados.length > 0 ? (totalRecaudadoReal / accionistasRealesFiltrados.length) : 0;
  const totalPaginasReal = Math.ceil(accionistasRealesFiltrados.length / (itemsPorPaginaAccionistas || 10)) || 1;

  const calcularMontoRealCelda = (accionista, anio) => {
    if (!accionista?.pagos) return 0;
    const pagos = anio === "Todos" 
      ? accionista.pagos 
      : accionista.pagos.filter(p => {
          const f = p.fechaRegistro || p.fechaIngresoMulta;
          return f && new Date(f).getFullYear().toString() === anio;
        });
    return pagos.reduce((s, p) => s + Number(p.monto || 0), 0);
  };


  
  
  const calcularMontoRealPorAnioMock = (accionistaId, anio) => {
    if (anio === "Todos") {
      return pagosDiariosData
        .filter(pago => pago.accionistaId === accionistaId)
        .reduce((sum, pago) => sum + Number(pago.monto || 0), 0);
    }
    return pagosDiariosData
      .filter(pago => pago.accionistaId === accionistaId && pago.fechaPago && pago.fechaPago.includes(anio))
      .reduce((sum, pago) => sum + Number(pago.monto || 0), 0);
  };

  const calcularTotalAnioSeleccionadoMock = () => {
    const data = selectedYear === "Todos" ? pagosDiariosData : (pagosDiariosData || []).filter(p => p.fechaPago?.includes(selectedYear));
    return (data || []).reduce((sum, p) => sum + Number(p.monto || 0), 0);
  };

  const calcularPromedioMultasMock = () => {
    const total = calcularTotalAnioSeleccionadoMock();
    return total > 0 ? Math.round(total / (filteredAccionistas.length || 1)) : 0;
  };


  const obtenerDatosAMostrar = () => {
    if (!usarDatosReales) return obtenerAccionistasPaginaActual() || [];
    const inicio = (paginaActualAccionistas - 1) * itemsPorPaginaAccionistas;
    return accionistasRealesFiltrados.slice(inicio, inicio + itemsPorPaginaAccionistas);
  };

  return (
    <>
      <div className="bg-aneupi-primary text-white p-7 border-b border-aneupi-primary-dark">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-3">Registro de Multas Anuales - ANEUPI</h2>
            <p className="text-white/80">
                Control de multas - {usarDatosReales ? accionistasRealesFiltrados.length : (totalAccionistas || 0)} accionistas
            </p>
          </div>
          <div className="flex items-center gap-5">
            <button
              onClick={() => { setUsarDatosReales(!usarDatosReales); setPaginaActualAccionistas(1); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold border transition-all ${
                usarDatosReales ? 'bg-green-600 border-green-400 text-white shadow-lg' : 'bg-white/10 border-white/20 text-white/70'
              }`}
            >
              <FaDatabase className={usarDatosReales ? 'animate-pulse' : ''} />
              {usarDatosReales ? "MODO REAL" : "MODO MOCK"}
            </button>
            <div className="relative">
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="input-aneupi px-9 py-2.5">
                <option value="Todos">Todos los años</option>
                {(anios || []).map(anio => <option key={anio} value={anio}>{anio}</option>)}
              </select>
              <FaCalendarAlt className="absolute right-4 top-1/2 -translate-y-1/2" />
            </div>
            <button onClick={() => exportarAExcel("accionistas")} className="btn-aneupi-secondary flex items-center gap-2">
              <FaFileExcel /> Exportar
            </button>
          </div>
        </div>
        <div className="relative max-w-md">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" />
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar..." className="input-aneupi w-full pl-12 py-3.5" />
        </div>
      </div>

      <div className="tablas overflow-x-auto">
        <table className="table-aneupi">
          <thead className="bg-aneupi-bg-tertiary">
            <tr>
              <th className="text-aneupi-primary">N°</th>
              <th className="text-aneupi-primary">Accionistas</th>
              {(anios || []).map(anio => <th key={anio} className="text-center text-aneupi-primary">{anio}</th>)}
              <th className="text-center text-aneupi-primary">Total Multas</th>
            </tr>
          </thead>
          <tbody>
            {obtenerDatosAMostrar().map((accionista, index) => {
              const totalM = usarDatosReales 
                ? calcularMontoRealCelda(accionista, selectedYear)
                : (selectedYear === "Todos" ? calcularTotalMultasAccionista(accionista.id) : calcularMontoRealPorAnioMock(accionista.id, selectedYear));
              
              return (
                <tr key={accionista.id || index} className={`hover:bg-aneupi-bg-tertiary transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-aneupi-bg-tertiary'}`}>
                  <td className="font-bold text-aneupi-primary text-lg">{accionista.id}</td>
                  <td>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-aneupi-primary rounded-full flex items-center justify-center text-white font-bold border border-aneupi-primary-dark">
                        {(accionista.nombre || "U").charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-aneupi-primary">{accionista.nombre || "Sin nombre"}</p>
                        <p className="text-sm text-aneupi-text-muted">{accionista.codigo || "S/C"}</p>
                      </div>
                    </div>
                  </td>
                  {(anios || []).map(anio => {
                    const monto = usarDatosReales ? calcularMontoRealCelda(accionista, anio) : calcularMontoRealPorAnioMock(accionista.id, anio);
                    return (
                      <td key={anio} className="text-center font-medium">
                        ${(monto || 0).toLocaleString()}
                      </td>
                    );
                  })}
                  <td className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-aneupi-primary text-white rounded-full font-bold">
                      ${(totalM || 0).toLocaleString()}
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
        totalPaginas={usarDatosReales ? totalPaginasReal : totalPaginasAccionistas}
        itemsPorPagina={itemsPorPaginaAccionistas}
        setItemsPorPagina={setItemsPorPaginaAccionistas}
        totalItems={usarDatosReales ? accionistasRealesFiltrados.length : totalItems}
        itemsPaginaActual={obtenerDatosAMostrar().length}
      />

      <div className="bg-aneupi-bg-tertiary p-7 border-t grid grid-cols-1 md:grid-cols-3 gap-7">
        <div className="card-aneupi">
          <h3 className="font-medium text-aneupi-primary mb-3">Total {selectedYear}</h3>
          <p className="text-2xl font-bold text-aneupi-primary">
            ${(usarDatosReales ? totalRecaudadoReal : calcularTotalAnioSeleccionadoMock()).toLocaleString()}
          </p>
        </div>
        <div className="card-aneupi">
          <h3 className="font-medium text-aneupi-primary mb-3">Promedio</h3>
          <p className="text-2xl font-bold text-aneupi-primary">
            ${(usarDatosReales ? promedioReal : calcularPromedioMultasMock()).toLocaleString()}
          </p>
        </div>
        <div className="card-aneupi">
          <h3 className="font-medium text-aneupi-primary mb-3">Filtrados</h3>
          <p className="text-2xl font-bold text-aneupi-primary">
            {usarDatosReales ? accionistasRealesFiltrados.length : (filteredAccionistas?.length || 0)} de {usarDatosReales ? accionistasReales.length : (totalAccionistas || 0)}
          </p>
        </div>
      </div>
    </>
  );
};

export default AccionistasTab;