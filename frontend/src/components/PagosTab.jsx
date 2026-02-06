import { FaCalendarWeek, FaCalendarDay, FaCalendarAlt, FaUser, FaEnvelope, FaMobileAlt, FaWindowClose, FaClipboardList, FaCheckCircle, FaClock, FaTimesCircle, FaCogs, FaEye, FaSortUp, FaSortDown, FaBell, FaDollarSign, FaDatabase } from "react-icons/fa";
import Paginacion from "./Paginacion";
import AbonosModal from "./AbonosModal";
import { generarAbonosParaMulta } from "../utils/dataGenerators";
import { useState, useEffect } from "react";

const PagosTab = ({
  accionistaSeleccionado,
  setAccionistaSeleccionado,
  viewTypePagos,
  setViewTypePagos,
  selectedYearPagos,
  setSelectedYearPagos,
  selectedMonth,
  setSelectedMonth,
  selectedDay,
  setSelectedDay,
  meses,
  dias,
  anios,
  estadisticasAccionista,
  pagosFiltrados,
  mapaAccionistas,
  handleSeleccionarAccionistaDesdePagos,
  sortConfigPagos,
  handleSortPagos,
  obtenerPagosPaginaActual,
  calcularTotalMontosPaginaActual,
  calcularTotalPagosFiltrados,
  paginaActualPagos,
  setPaginaActualPagos,
  totalPaginasPagos,
  itemsPorPaginaPagos,
  setItemsPorPaginaPagos,
  totalItems,
  totalAccionistas
}) => {
  const [modalAbonos, setModalAbonos] = useState({ isOpen: false, multa: null, abonos: [] });
  
  // --- ESTADOS BACKEND REAL (SOLO LECTURA) ---
  const [pagosReales, setPagosReales] = useState([]);
  const [usarDatosReales, setUsarDatosReales] = useState(false);

  // Cargar datos al iniciar
  useEffect(() => {
    cargarDatosReales();
  }, []);

  const cargarDatosReales = () => {
    fetch('http://localhost:3000/api/pagos')
      .then(res => res.json())
      .then(data => setPagosReales(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error pagos:", err));
  };

  // Filtrado de datos (Mantenemos igual)
  const pagosRealesFiltrados = pagosReales.filter(pago => {
    if (!usarDatosReales) return false;
    const fecha = new Date(pago.fechaRegistro || pago.fechaIngresoMulta);
    const anioOk = selectedYearPagos === "Todos" || fecha.getFullYear().toString() === selectedYearPagos;
    const nombreMes = meses[fecha.getMonth()];
    const mesOk = selectedMonth === "Todos" || nombreMes === selectedMonth;
    const diaOk = selectedDay === "Todos" || fecha.getDate() === Number(selectedDay);
    return anioOk && mesOk && (viewTypePagos === "mensual" ? true : diaOk);
  });

  const totalDineroRealFiltrado = pagosRealesFiltrados.reduce((sum, p) => sum + Number(p.monto), 0);
  const totalPaginasReales = Math.ceil(pagosRealesFiltrados.length / itemsPorPaginaPagos);

  const obtenerDatosAMostrar = () => {
    if (!usarDatosReales) return obtenerPagosPaginaActual();
    const inicio = (paginaActualPagos - 1) * itemsPorPaginaPagos;
    const fin = inicio + itemsPorPaginaPagos;
    return pagosRealesFiltrados.slice(inicio, fin);
  };

  const renderEstado = (estado) => {
    switch(estado) {
      case "Completado": return <FaCheckCircle className="text-xs" />;
      case "Pendiente": return <FaClock className="text-xs" />;
      case "Rechazado": return <FaTimesCircle className="text-xs" />;
      default: return <FaCogs className="text-xs" />;
    }
  };

  return (
    <>
      <div className="bg-aneupi-primary text-white p-7 border-b border-aneupi-primary-dark">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-3">
              {accionistaSeleccionado ? `Historial de Pagos - ${accionistaSeleccionado.nombre}` : "Registro de Pagos de Multas - ANEUPI"}
            </h2>
            <p className="text-white/80">
              {accionistaSeleccionado ? `Historial completo de pagos` : `Control de pagos (${usarDatosReales ? 'Base de Datos PostgreSQL' : 'Simulación'})`}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* BOTÓN REGISTRAR ELIMINADO */}
            
            <button onClick={() => { setUsarDatosReales(!usarDatosReales); setPaginaActualPagos(1); }} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all border ${usarDatosReales ? 'bg-green-600 border-green-400 text-white shadow-lg' : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'}`}>
              <FaDatabase className={usarDatosReales ? 'animate-pulse' : ''} /> {usarDatosReales ? "MODO REAL" : "MODO MOCK"}
            </button>

            {!accionistaSeleccionado && (
              <div className="flex gap-2">
                <button onClick={() => { setViewTypePagos("mensual"); setSelectedDay("Todos"); }} className={`px-4 py-2 rounded-lg transition-all border ${viewTypePagos === "mensual" ? "bg-white/20 text-white font-bold border-white/50" : "bg-white/5 text-white/50 border-white/10"}`}>
                  <FaCalendarWeek className="inline mr-2" /> Mensual
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Filtros */}
        {!accionistaSeleccionado && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <select value={selectedYearPagos} onChange={(e) => setSelectedYearPagos(e.target.value)} className="w-full bg-white/20 border border-white/30 rounded-lg px-9 py-2.5 text-white appearance-none outline-none cursor-pointer">
                <option value="Todos" className="text-black">Todos los años</option>
                {anios.map(anio => <option key={anio} value={anio} className="text-black">{anio}</option>)}
              </select>
              <FaCalendarAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70" />
            </div>
            <div className="relative">
              <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="w-full bg-white/20 border border-white/30 rounded-lg px-9 py-2.5 text-white appearance-none outline-none cursor-pointer">
                <option value="Todos" className="text-black">Todos los meses</option>
                {meses.map(mes => <option key={mes} value={mes} className="text-black">{mes}</option>)}
              </select>
              <FaCalendarAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70" />
            </div>
          </div>
        )}
      </div>

      {/* TABLA DE DATOS */}
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full">
          <thead className="bg-aneupi-bg-tertiary">
            <tr>
              <th className="py-4 px-6 text-left text-aneupi-primary font-bold border-b-2 border-aneupi-primary/20">ID</th>
              <th className="py-4 px-6 text-left text-aneupi-primary font-bold border-b-2 border-aneupi-primary/20">Accionista</th>
              <th className="py-4 px-6 text-left text-aneupi-primary font-bold border-b-2 border-aneupi-primary/20">Fecha</th>
              <th className="py-4 px-6 text-left text-aneupi-primary font-bold border-b-2 border-aneupi-primary/20">Descripción</th>
              <th className="py-4 px-6 text-left text-aneupi-primary font-bold border-b-2 border-aneupi-primary/20">Monto</th>
              <th className="py-4 px-6 text-left text-aneupi-primary font-bold border-b-2 border-aneupi-primary/20">Estado</th>
            </tr>
          </thead>
          <tbody>
            {obtenerDatosAMostrar().map((pago, index) => (
              <tr key={pago.id} className={`hover:bg-aneupi-primary/5 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <td className="py-4 px-6 border-b border-gray-200 font-bold text-gray-700">#{pago.id}</td>
                <td className="py-4 px-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-aneupi-primary text-white flex items-center justify-center text-xs font-bold">
                      {pago.accionista?.nombre?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{pago.accionista?.nombre || 'Accionista Desconocido'}</p>
                      <p className="text-xs text-gray-500 font-mono bg-gray-100 px-1 rounded inline-block mt-0.5">
                        {pago.referencia || 'Sin Ref'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 border-b border-gray-200 text-sm text-gray-600">
                  {new Date(pago.fechaRegistro || pago.fechaIngresoMulta).toLocaleDateString()}
                </td>
                <td className="py-4 px-6 border-b border-gray-200 text-sm text-gray-600 max-w-[200px] truncate">
                  {pago.descripcion}
                </td>
                <td className="py-4 px-6 border-b border-gray-200 font-bold text-aneupi-primary">
                  ${Number(pago.monto).toFixed(2)}
                </td>
                <td className="py-4 px-6 border-b border-gray-200">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                    pago.estado === 'Completado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {renderEstado(pago.estado)} {pago.estado}
                  </span>
                </td>
              </tr>
            ))}
            {obtenerDatosAMostrar().length === 0 && (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-400">
                  No se encontraron registros {usarDatosReales ? 'en la Base de Datos' : 'en la simulación'}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Paginacion
        tipo="pagos"
        paginaActual={paginaActualPagos}
        setPaginaActual={setPaginaActualPagos}
        totalPaginas={usarDatosReales ? totalPaginasReales : totalPaginasPagos}
        itemsPorPagina={itemsPorPaginaPagos}
        setItemsPorPagina={setItemsPorPaginaPagos}
        totalItems={usarDatosReales ? pagosRealesFiltrados.length : totalItems}
        itemsPaginaActual={obtenerDatosAMostrar().length}
        calcularTotalMontosPaginaActual={() => 
          usarDatosReales 
            ? obtenerDatosAMostrar().reduce((sum, p) => sum + Number(p.monto), 0)
            : calcularTotalMontosPaginaActual()
        }
        calcularTotalPagosFiltrados={() => 
          usarDatosReales ? totalDineroRealFiltrado : calcularTotalPagosFiltrados()
        }
      />

      <AbonosModal
        isOpen={modalAbonos.isOpen}
        onClose={() => setModalAbonos({ isOpen: false, multa: null, abonos: [] })}
        multa={modalAbonos.multa}
        abonos={modalAbonos.abonos}
      />
    </>
  );
};

export default PagosTab;