import { useState } from "react";
import { 
  FaCalendarWeek, FaCalendarAlt, FaCheckCircle, FaClock, FaTimesCircle, 
  FaCogs, FaDatabase, FaFileUpload, FaCheck, FaTimes, FaHistory, FaEye 
} from "react-icons/fa";
import Paginacion from "./Paginacion";
import AbonosModal from "./AbonosModal";
import SubirComprobanteModal from "./SubirComprobanteModal";
import { toast } from "sonner"; 
import { pagosService } from "../services"; 

const PagosTab = ({
  viewTypePagos,
  setViewTypePagos,
  selectedYearPagos,
  setSelectedYearPagos,
  selectedMonth,
  setSelectedMonth,
  selectedDay,
  setSelectedDay,
  meses,
  anios,
  pagosFiltrados, 
  obtenerPagosPaginaActual,
  paginaActualPagos,
  setPaginaActualPagos,
  totalPaginasPagos,
  itemsPorPaginaPagos,
  setItemsPorPaginaPagos,
  totalItems,
  esAdmin, 
  usuarioActual
}) => {
  const [modalAbonos, setModalAbonos] = useState({ isOpen: false, multa: null, abonos: [] });
  const [modalSubida, setModalSubida] = useState({ isOpen: false, pago: null });

  // Función para ver comprobante
  const verComprobante = (url) => {
    if (!url) return;
    const baseUrl = "http://localhost:3000/"; 
    const finalUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;
    window.open(finalUrl, "_blank");
  };

  const renderEstado = (estado) => {
    switch(estado) {
      case "Completado": return <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-bold border border-green-200"><FaCheckCircle/> Completado</span>;
      case "Pendiente": return <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-xs font-bold border border-yellow-200"><FaClock/> Pendiente</span>;
      case "Rechazado": return <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded-md text-xs font-bold border border-red-200"><FaTimesCircle/> Rechazado</span>;
      case "En_proceso": return <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-bold border border-blue-200"><FaHistory/> Revisión</span>;
      default: return <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-bold"><FaCogs/> {estado}</span>;
    }
  };

  const handleAprobarPago = async (pagoId) => {
    if(!confirm("¿Aprobar pago?")) return;
    try {
        toast.info("Procesando...");
        await pagosService.updateEstado(pagoId, 'Completado');
        toast.success("Aprobado");
        window.location.reload(); 
    } catch (error) {
        toast.error("Error al procesar");
    }
  };

  const handleRechazarPago = async (pagoId) => {
    if(!confirm("¿Rechazar pago?")) return;
    try {
        await pagosService.updateEstado(pagoId, 'Rechazado');
        toast.error("Rechazado");
        window.location.reload(); 
    } catch (error) {
        toast.error("Error al procesar");
    }
  };

  const handleSubirComprobante = (pago) => {
    setModalSubida({ isOpen: true, pago });
  };

  const handleUploadSuccess = () => {
    setModalSubida({ isOpen: false, pago: null });
    window.location.reload();
  };

  const datosTabla = obtenerPagosPaginaActual(); 
  const totalMontoPagina = datosTabla.reduce((sum, p) => sum + Number(p.monto || 0), 0);
  const totalMontoFiltrado = pagosFiltrados.reduce((sum, p) => sum + Number(p.monto || 0), 0);

  return (
    <>
      {/* --- ENCABEZADO AZUL OSCURO (RESTAURADO) --- */}
      <div className="bg-aneupi-primary text-white p-7 border-b border-aneupi-primary-dark">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-3">
              {esAdmin ? "Gestión de Pagos y Multas" : "Registro de Pagos de Multas - ANEUPI"}
            </h2>
            <p className="text-white/80 flex items-center gap-2">
              <FaDatabase className="text-sm" /> 
              {esAdmin 
                ? "Administra, aprueba o rechaza los reportes de pago." 
                : "Control de pagos (Base de Datos PostgreSQL)."}
            </p>
          </div>
          
          {/* FILTROS CON ESTILO TRANSPARENTE/BLANCO */}
          <div className="flex gap-4">
             <div className="relative">
                <select 
                  value={selectedYearPagos} 
                  onChange={(e) => setSelectedYearPagos(e.target.value)} 
                  className="bg-white/20 border border-white/30 text-white text-sm rounded-lg block w-40 p-2.5 focus:outline-none focus:bg-white/30 cursor-pointer"
                >
                  <option value="Todos" className="text-black">Año: Todos</option>
                  {anios.map(anio => <option key={anio} value={anio} className="text-black">{anio}</option>)}
                </select>
                <FaCalendarAlt className="absolute right-3 top-3 text-white/70 text-xs pointer-events-none"/>
             </div>
             <div className="relative">
                <select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(e.target.value)} 
                  className="bg-white/20 border border-white/30 text-white text-sm rounded-lg block w-40 p-2.5 focus:outline-none focus:bg-white/30 cursor-pointer"
                >
                  <option value="Todos" className="text-black">Mes: Todos</option>
                  {meses.map(mes => <option key={mes} value={mes} className="text-black">{mes}</option>)}
                </select>
                <FaCalendarAlt className="absolute right-3 top-3 text-white/70 text-xs pointer-events-none"/>
             </div>
          </div>
        </div>
      </div>

      {/* --- TABLA DE DATOS --- */}
      <div className="overflow-x-auto min-h-[400px] bg-white shadow-sm">
        <table className="w-full text-sm text-left">
          {/* Cabecera de la tabla en gris claro para contraste profesional */}
          <thead className="text-xs text-aneupi-primary uppercase bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-bold">ID</th>
              <th className="px-6 py-4 font-bold">{esAdmin ? "Accionista" : "Concepto"}</th>
              <th className="px-6 py-4 font-bold">Fecha</th>
              <th className="px-6 py-4 font-bold">Estado</th>
              <th className="px-6 py-4 font-bold">Monto</th>
              <th className="px-6 py-4 font-bold text-center">Evidencia</th>
              <th className="px-6 py-4 font-bold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datosTabla.map((pago) => (
              <tr key={pago.id} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-mono text-gray-400">#{pago.id}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800 text-sm">
                        {esAdmin ? (pago.accionista?.nombre || "Usuario") : pago.descripcion}
                    </span>
                    <span className="text-xs text-gray-500 mt-0.5">{esAdmin ? pago.descripcion : pago.referencia}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(pago.fechaRegistro || pago.fechaIngresoMulta).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">{renderEstado(pago.estado)}</td>
                <td className="px-6 py-4 font-bold text-gray-800">${Number(pago.monto).toFixed(2)}</td>
                
                {/* COLUMNA EVIDENCIA (BOTÓN AZUL CLARO) */}
                <td className="px-6 py-4 text-center">
                   {pago.comprobante ? (
                      <button 
                        onClick={() => verComprobante(pago.comprobante)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors border border-blue-200"
                      >
                        <FaEye /> Ver Foto
                      </button>
                   ) : (
                      <span className="text-gray-400 text-xs italic bg-gray-100 px-2 py-1 rounded">Sin archivo</span>
                   )}
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center gap-2">
                    
                    {/* ADMIN: APROBAR / RECHAZAR */}
                    {esAdmin && (pago.estado === "Pendiente" || pago.estado === "En_proceso") && (
                        <>
                            <button onClick={() => handleAprobarPago(pago.id)} className="flex items-center gap-1 px-3 py-1.5 bg-white border border-green-500 text-green-600 rounded hover:bg-green-50 text-xs font-bold shadow-sm transition-all" title="Aprobar">
                                <FaCheck /> Aprobar
                            </button>
                            <button onClick={() => handleRechazarPago(pago.id)} className="flex items-center gap-1 px-3 py-1.5 bg-white border border-red-500 text-red-600 rounded hover:bg-red-50 text-xs font-bold shadow-sm transition-all" title="Rechazar">
                                <FaTimes /> Rechazar
                            </button>
                        </>
                    )}

                    {/* USUARIO: PAGAR */}
                    {!esAdmin && (pago.estado === "Pendiente" || pago.estado === "Rechazado") && (
                        <button 
                            onClick={() => handleSubirComprobante(pago)}
                            className="flex items-center gap-2 px-4 py-2 bg-aneupi-primary text-white rounded-lg text-xs font-bold hover:bg-aneupi-primary-dark shadow-md transform hover:-translate-y-0.5 transition-all"
                        >
                            <FaFileUpload /> {pago.estado === "Rechazado" ? "Reintentar" : "Pagar"}
                        </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {datosTabla.length === 0 && (
              <tr>
                <td colSpan="7" className="py-12 text-center text-gray-400 bg-gray-50/30">
                   <div className="flex flex-col items-center justify-center gap-2">
                      <FaDatabase className="text-4xl opacity-20"/>
                      <p>No se encontraron registros en la Base de Datos.</p>
                   </div>
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
        totalPaginas={totalPaginasPagos}
        itemsPorPagina={itemsPorPaginaPagos}
        setItemsPorPagina={setItemsPorPaginaPagos}
        totalItems={totalItems}
        itemsPaginaActual={datosTabla.length}
        calcularTotalMontosPaginaActual={() => totalMontoPagina}
        calcularTotalPagosFiltrados={() => totalMontoFiltrado}
      />

      <AbonosModal
        isOpen={modalAbonos.isOpen}
        onClose={() => setModalAbonos({ isOpen: false, multa: null, abonos: [] })}
        multa={modalAbonos.multa}
        abonos={modalAbonos.abonos}
      />

      <SubirComprobanteModal 
        isOpen={modalSubida.isOpen}
        onClose={() => setModalSubida({ isOpen: false, pago: null })}
        pago={modalSubida.pago}
        onUploadSuccess={handleUploadSuccess}
      />
    </>
  );
};

export default PagosTab;