import { FaCalendarWeek, FaCalendarDay, FaCalendarAlt, FaUser, FaEnvelope, FaMobileAlt, FaWindowClose, FaClipboardList, FaCheckCircle, FaClock, FaTimesCircle, FaCogs, FaEye, FaSortUp, FaSortDown, FaBell, FaDollarSign } from "react-icons/fa";
import Paginacion from "./Paginacion";
import AbonosModal from "./AbonosModal";
import { generarAbonosParaMulta } from "../utils/dataGenerators";
import { useState } from "react";

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

  const handleVerAbonos = (pago) => {
    const abonos = generarAbonosParaMulta(pago);
    setModalAbonos({ isOpen: true, multa: pago, abonos });
  };

  const renderEstado = (estado) => {
    switch(estado) {
      case "Completado": return <FaCheckCircle className="text-xs" />;
      case "Pendiente": return <FaClock className="text-xs" />;
      case "Rechazado": return <FaTimesCircle className="text-xs" />;
      case "En proceso": return <FaCogs className="text-xs" />;
      default: return null;
    }
  };

  return (
    <>
      <div className="bg-aneupi-primary text-white p-7 border-b border-aneupi-primary-dark">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-3">
              {accionistaSeleccionado 
                ? `Historial de Pagos - ${accionistaSeleccionado.nombre}` 
                : "Registro de Pagos de Multas - ANEUPI"}
            </h2>
            <p className="text-white/80">
              {accionistaSeleccionado 
                ? `Historial completo de pagos de multas del accionista seleccionado` 
                : `Control de pagos de multas - ${totalAccionistas} accionistas principales`}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {!accionistaSeleccionado && (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setViewTypePagos("mensual");
                    setSelectedDay("Todos");
                  }}
                  className={`px-4 py-2 rounded-lg transition-all border ${
                    viewTypePagos === "mensual" 
                      ? "bg-aneupi-secondary text-white font-bold border-aneupi-secondary" 
                      : "bg-white/20 text-white hover:bg-white/30 border-white/30"
                  }`}
                >
                  <FaCalendarWeek className="inline mr-2" />
                  Mensual
                </button>
                <button
                  onClick={() => setViewTypePagos("diario")}
                  className={`px-4 py-2 rounded-lg transition-all border ${
                    viewTypePagos === "diario" 
                      ? "bg-aneupi-secondary text-white font-bold border-aneupi-secondary" 
                      : "bg-white/20 text-white hover:bg-white/30 border-white/30"
                  }`}
                >
                  <FaCalendarDay className="inline mr-2" />
                  Diario
                </button>
              </div>
            )}
          </div>
        </div>

        {!accionistaSeleccionado && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <select
                value={selectedYearPagos}
                onChange={(e) => setSelectedYearPagos(e.target.value)}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-9 py-2.5 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-aneupi-secondary focus:bg-white/30 transition-colors"
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

            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  if (viewTypePagos === "diario") {
                    setSelectedDay(1);
                  }
                }}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-9 py-2.5 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-aneupi-secondary focus:bg-white/30 transition-colors"
              >
                <option value="Todos" className="text-aneupi-primary">Todos los meses</option>
                {meses.map(mes => (
                  <option key={mes} value={mes} className="text-aneupi-primary">
                    {mes}
                  </option>
                ))}
              </select>
              <FaCalendarAlt className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white" />
            </div>

            {viewTypePagos === "diario" && selectedMonth !== "Todos" && (
              <div className="relative">
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value === "Todos" ? "Todos" : Number(e.target.value))}
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-9 py-2.5 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-aneupi-secondary focus:bg-white/30 transition-colors"
                >
                  {dias.map(dia => (
                    <option key={dia} value={dia} className="text-aneupi-primary">
                      {dia === "Todos" ? "Todos los días" : `Día ${dia}`}
                    </option>
                  ))}
                </select>
                <FaCalendarDay className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white" />
              </div>
            )}
          </div>
        )}

        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm border-2 border-white/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80">Asambleas con Fechas</p>
                <p className="text-2xl font-bold mt-1">{estadisticasAccionista.asambleasConFechas}</p>
              </div>
              <FaCalendarAlt className="text-2xl text-white" />
            </div>
            <p className="text-white/60 text-sm mt-2">
              {accionistaSeleccionado 
                ? `Multas por asamblea de ${accionistaSeleccionado.nombre.split(' ')[0]}`
                : 'Multas por asamblea'}
            </p>
          </div>
          <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm border-2 border-white/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80">Atrasos</p>
                <p className="text-2xl font-bold mt-1">{estadisticasAccionista.atrasos}</p>
              </div>
              <FaClock className="text-2xl text-white" />
            </div>
            <p className="text-white/60 text-sm mt-2">
              {accionistaSeleccionado 
                ? `Atrasos de ${accionistaSeleccionado.nombre.split(' ')[0]}`
                : 'Multas por atraso'}
            </p>
          </div>
          <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm border-2 border-white/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80">Otras Multas</p>
                <p className="text-2xl font-bold mt-1">{estadisticasAccionista.otrasMultas}</p>
              </div>
              <FaClipboardList className="text-2xl text-white" />
            </div>
            <p className="text-white/60 text-sm mt-2">
              {accionistaSeleccionado 
                ? `Otras multas de ${accionistaSeleccionado.nombre.split(' ')[0]}`
                : 'Multas diversas'}
            </p>
          </div>
          <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm border-2 border-white/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80">Total a Pagar</p>
                <p className="text-2xl font-bold mt-1">${estadisticasAccionista.totalAPagar.toLocaleString()}</p>
              </div>
              <FaCheckCircle className="text-2xl text-white" />
            </div>
            <p className="text-white/60 text-sm mt-2">
              {accionistaSeleccionado 
                ? `Total de ${accionistaSeleccionado.nombre.split(' ')[0]}`
                : 'Monto total acumulado'}
            </p>
          </div>
        </div> */}

        {accionistaSeleccionado && (
          <div className="mt-4 bg-white/10 p-5 rounded-xl backdrop-blur-sm border-2 border-white/20">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-14 h-14 bg-aneupi-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-sm border-2 border-aneupi-primary">
                  {accionistaSeleccionado.nombre.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                    <p className="font-bold text-white text-lg">{accionistaSeleccionado.nombre}</p>
                    <div className="flex items-center gap-2 mt-1 md:mt-0">
                      <span className="text-white/80 text-sm bg-white/20 px-2 py-1 rounded border-2 border-white/30">
                        {accionistaSeleccionado.codigo}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-white/60 text-sm" />
                      <p className="text-sm text-white truncate">{accionistaSeleccionado.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMobileAlt className="text-white/60 text-sm" />
                      <p className="text-sm text-white">{accionistaSeleccionado.telefono}</p>
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  setAccionistaSeleccionado(null);
                }}
                className="ml-auto px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2 border-2 border-white/30"
              >
                <FaWindowClose /> Limpiar Selección
              </button>
            </div>
            
            <div className="mt-4 pt-4 border-t-2 border-white/20">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white/80">Resumen de Historial:</p>
                <div className="relative">
                  <select
                    value={selectedYearPagos}
                    onChange={(e) => setSelectedYearPagos(e.target.value)}
                    className="bg-white/20 border border-white/30 rounded-lg px-8 py-1.5 text-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-aneupi-secondary focus:bg-white/30 transition-colors"
                  >
                    <option value="Todos" className="text-aneupi-primary">Todos los años</option>
                    {anios.map(anio => (
                      <option key={anio} value={anio} className="text-aneupi-primary">
                        {anio}
                      </option>
                    ))}
                  </select>
                  <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-xs" />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-3 bg-white/10 rounded-lg border-2 border-white/20">
                  <p className="text-xs text-white/60">Total multas</p>
                  <p className="text-xl font-bold text-white">{pagosFiltrados.length}</p>
                </div>
                <div className="text-center p-3 bg-white/10 rounded-lg border-2 border-white/20">
                  <p className="text-xs text-white/60">Total Pagos</p>
                  <p className="text-xl font-bold text-white">{pagosFiltrados.filter(p => p.estado === "Completado").length}</p>
                </div>
                <div className="text-center p-3 bg-white/10 rounded-lg border-2 border-white/20">
                  <p className="text-xs text-white/60">Último Pago</p>
                  <p className="text-sm font-bold text-white">
                    {(() => {
                      const pagosCompletados = pagosFiltrados.filter(p => p.estado === "Completado" && p.fechaPago);
                      if (pagosCompletados.length === 0) return 'N/A';
                      const ultimoPago = pagosCompletados.sort((a, b) => new Date(b.fechaPago) - new Date(a.fechaPago))[0];
                      return ultimoPago.fechaPago;
                    })()}
                  </p>
                </div>
                <div className="text-center p-3 bg-white/10 rounded-lg border-2 border-white/20">
                  <p className="text-xs text-white/60">Total Pagado</p>
                  <p className="text-sm font-bold text-white">
                    ${pagosFiltrados.length > 0 
                      ? Math.round(pagosFiltrados.filter(p => p.estado === "Completado").reduce((sum, p) => sum + p.monto, 0)).toLocaleString()
                      : '0'}
                  </p>
                </div>
                <div className="text-center p-3 bg-white/10 rounded-lg border-2 border-white/20">
                  <p className="text-xs text-white/60">Total Pendiente</p>
                  <p className="text-sm font-bold text-white">
                    ${pagosFiltrados.length > 0 
                      ? Math.round(pagosFiltrados.filter(p => p.estado === "Pendiente").reduce((sum, p) => sum + p.monto, 0)).toLocaleString()
                      : '0'}
                  </p>
                </div>
                <div className="text-center p-3 bg-white/10 rounded-lg border-2 border-white/20">
                  <p className="text-xs text-white/60">Total valores</p>
                  <p className="text-sm font-bold text-white">
                    ${pagosFiltrados.length > 0 
                      ? Math.round(pagosFiltrados.reduce((sum, p) => sum + p.monto, 0)).toLocaleString()
                      : '0'}
                  </p>
                </div>
                <div className="text-center p-3 bg-white/10 rounded-lg border-2 border-white/20">
                  <p className="text-xs text-white/60">Eficiencia</p>
                  <p className="text-sm font-bold text-white">
                    {pagosFiltrados.length > 0 
                      ? Math.round((pagosFiltrados.filter(p => p.estado === "Completado").length / pagosFiltrados.length) * 100) 
                      : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-aneupi-bg-tertiary">
            <tr>
              <th className="py-5 px-7 text-left font-semibold text-aneupi-primary border-b-2 border-aneupi-primary">
                <button 
                  onClick={() => handleSortPagos('id')}
                  className="flex items-center gap-2 hover:text-aneupi-primary-dark transition-colors"
                >
                  N°
                  {sortConfigPagos.key === 'id' && (
                    sortConfigPagos.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                  )}
                </button>
              </th>
              <th className="py-5 px-7 text-left font-semibold text-aneupi-primary border-b-2 border-aneupi-primary">
                Accionistas
              </th>
              <th className="py-5 px-7 text-left font-semibold text-aneupi-primary border-b-2 border-aneupi-primary">
                <button 
                  onClick={() => handleSortPagos('fechaIngresoMulta')}
                  className="flex items-center gap-2 hover:text-aneupi-primary-dark transition-colors"
                >
                  Fecha Ingreso Multa
                  {sortConfigPagos.key === 'fechaIngresoMulta' && (
                    sortConfigPagos.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                  )}
                </button>
              </th>
              <th className="py-5 px-7 text-left font-semibold text-aneupi-primary border-b-2 border-aneupi-primary">
                <button 
                  onClick={() => handleSortPagos('fechaPago')}
                  className="flex items-center gap-2 hover:text-aneupi-primary-dark transition-colors"
                >
                  Fecha Pago
                  {sortConfigPagos.key === 'fechaPago' && (
                    sortConfigPagos.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                  )}
                </button>
              </th>
              <th className="py-5 px-7 text-left font-semibold text-aneupi-primary border-b-2 border-aneupi-primary">
                Descripción
              </th>
              <th className="py-5 px-7 text-left font-semibold text-aneupi-primary border-b-2 border-aneupi-primary">
                <button 
                  onClick={() => handleSortPagos('monto')}
                  className="flex items-center gap-2 hover:text-aneupi-primary-dark transition-colors"
                >
                  Monto
                  {sortConfigPagos.key === 'monto' && (
                    sortConfigPagos.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                  )}
                </button>
              </th>
              <th className="py-5 px-7 text-left font-semibold text-aneupi-primary border-b-2 border-aneupi-primary">
                Estado
              </th>
              <th className="py-5 px-7 text-left font-semibold text-aneupi-primary border-b-2 border-aneupi-primary">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {obtenerPagosPaginaActual().map((pago, index) => (
              <tr 
                key={pago.id} 
                className={`hover:bg-aneupi-bg-tertiary transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-aneupi-bg-tertiary'}`}
              >
                <td className="py-5 px-7 border-b-2 border-aneupi-primary">
                  <div className="font-bold text-aneupi-primary text-lg">{pago.id}</div>
                </td>
                <td className="py-5 px-7 border-b-2 border-aneupi-primary">
                  <div 
                    className="cursor-pointer group"
                    onClick={() => handleSeleccionarAccionistaDesdePagos(pago.accionistaId)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-aneupi-primary rounded-full flex items-center justify-center text-white font-bold mt-1 group-hover:scale-110 transition-transform shadow-sm border-2 border-aneupi-primary">
                        {pago.accionistaId}
                      </div>
                      <div>
                        <p className="font-medium text-aneupi-primary group-hover:text-aneupi-primary-dark">{pago.accionista}</p>
                        <div className="mt-1">
                          <span className="inline-block px-2 py-0.5 bg-aneupi-secondary/20 text-aneupi-primary rounded text-xs border-2 border-aneupi-secondary/50">
                            {mapaAccionistas[pago.accionistaId]?.codigo || 'ANE-0000'}
                          </span>
                        </div>
                        <p className="text-xs text-aneupi-primary mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <FaUser className="text-xs" /> Ver historial completo
                        </p>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-7 border-b-2 border-aneupi-primary">
                  <span className="font-medium text-aneupi-primary">{pago.fechaIngresoMulta}</span>
                </td>
                <td className="py-5 px-7 border-b-2 border-aneupi-primary">
                  {pago.fechaPago ? (
                    <span className="font-medium text-aneupi-primary">{pago.fechaPago}</span>
                  ) : (
                    <span className="text-aneupi-text-muted italic">Pendiente</span>
                  )}
                </td>
                <td className="py-5 px-7 border-b-2 border-aneupi-primary">
                  <div className="max-w-xs">
                    <p className="text-sm text-aneupi-primary font-medium">{pago.descripcion}</p>
                    <p className="text-xs text-aneupi-text-muted mt-1">{pago.observacion}</p>
                    {pago.comprobante && (
                      <div className="mt-2">
                        <span className="inline-block px-2 py-1 bg-aneupi-secondary/20 text-aneupi-primary rounded text-xs border-2 border-aneupi-secondary/50">
                          {pago.comprobante}
                        </span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-5 px-7 border-b-2 border-aneupi-primary text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-xl font-bold text-aneupi-primary">
                      ${pago.monto.toLocaleString()}
                    </span>
                    {pago.estado === "Pendiente" && pago.abonosRealizados > 0 && (
                      <div className="mt-1">
                        <button
                          onClick={() => handleVerAbonos(pago)}
                          className="text-xs text-aneupi-primary hover:text-aneupi-primary-dark flex items-center gap-1 hover:underline"
                        >
                          <FaDollarSign className="text-xs" />
                          Ver abonos
                        </button>
                        <span className="text-xs text-aneupi-text-muted block mt-1">Abonado: ${pago.abonosRealizados.toLocaleString()}</span>
                        <span className="text-xs font-medium text-yellow-600 block">Saldo: ${(pago.monto - pago.abonosRealizados).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-5 px-7 border-b-2 border-aneupi-primary">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 ${
                    pago.estado === "Completado" 
                      ? "bg-green-100 text-green-700 border-green-300" 
                      : pago.estado === "Pendiente"
                      ? "bg-aneupi-secondary/20 text-aneupi-primary border-aneupi-secondary/50"
                      : "bg-red-100 text-red-700 border-red-300"
                  }`}>
                    {renderEstado(pago.estado)}
                    {pago.estado}
                  </span>
                </td>
                <td className="py-5 px-7 border-b-2 border-[#0D4367]">
                  <div className="flex items-center gap-2">
                    <button 
                      className="p-2 text-aneupi-primary hover:text-aneupi-primary-dark hover:bg-aneupi-secondary/10 rounded-lg transition-colors border-2 border-transparent hover:border-aneupi-secondary/50"
                      title="Ver detalles"
                      onClick={() => {
                        alert(`Detalles del pago:\nReferencia: ${pago.referencia}\nFecha: ${pago.fechaPago}\nMonto: $${pago.monto}\nEstado: ${pago.estado}\nDescripción: ${pago.descripcion}`);
                      }}
                    >
                      <FaBell/>
                    </button>
                    {/* {pago.estado === "Pendiente" && (
                      <button 
                        onClick={() => alert('La funcionalidad de pago está en desarrollo. Próximamente disponible.')}
                        className="px-3 py-1.5 bg-[#0D4367] text-white rounded-lg hover:bg-[#0B3A5C] font-medium text-sm transition-all shadow-sm hover:shadow border-2 border-[#0D4367]"
                        title="Pagar multa"
                      >
                        Pagar
                      </button>
                    )} */}
                  </div>
                </td>
              </tr>
            ))}
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
        itemsPaginaActual={obtenerPagosPaginaActual().length}
        calcularTotalMontosPaginaActual={calcularTotalMontosPaginaActual}
        calcularTotalPagosFiltrados={calcularTotalPagosFiltrados}
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