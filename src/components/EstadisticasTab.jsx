import { useState } from "react";
import { FaDollarSign, FaPercentage, FaExclamationTriangle, FaChartBar, FaCalendar, FaDatabase } from "react-icons/fa";

const EstadisticasTab = ({ 
  selectedYearStats, 
  setSelectedYearStats, 
  resumenMensual, 
  estadisticasAvanzadas,
  totalAccionistas
}) => {
  // Filtrar meses según el año seleccionado
  const mesesArray = Object.keys(resumenMensual).filter(mes => {
    if (selectedYearStats === "Todos") return true;
    return mes.includes(selectedYearStats);
  });
  
  const datosMensuales = mesesArray.map(mes => resumenMensual[mes]);
  
  // Calcular totales
  const totalGeneral = datosMensuales.reduce((acc, datos) => {
    acc.total += datos.total;
    acc.completados += datos.completados;
    acc.pendientes += datos.pendientes;
    acc.rechazados += datos.rechazados;
    acc.proceso += datos.proceso;
    return acc;
  }, { total: 0, completados: 0, pendientes: 0, rechazados: 0, proceso: 0 });
  
  totalGeneral.promedio = totalGeneral.total > 0 ? Math.round(totalGeneral.total / (totalGeneral.completados + totalGeneral.pendientes + totalGeneral.rechazados + totalGeneral.proceso)) : 0;

  return (
    <div className="p-7">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#0D4367] mb-4">Estadísticas Avanzadas - Sistema ANEUPI</h2>
            <p className="text-aneupi-text-secondary">Análisis detallado de multas y pagos ({totalAccionistas} accionistas)</p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-[#0D4367] font-medium">Año:</span>
            <select
              value={selectedYearStats}
              onChange={(e) => setSelectedYearStats(e.target.value)}
              className="px-4 py-2 border border-aneupi-border-light rounded-lg bg-white text-[#0D4367] focus:outline-none focus:ring-1 focus:ring-[#0D4367] focus:border-[#0D4367]"
            >
              <option value="Todos">Todos los años</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#0D4367] text-white p-6 rounded-xl shadow-lg border border-[#0B3A5C]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Multas Acumuladas</h3>
            <FaDollarSign className="text-2xl" />
          </div>
          <p className="text-3xl font-bold mb-2">${estadisticasAvanzadas.totalMultasAcumulado.toLocaleString()}</p>
          <p className="text-white/80 text-sm">Total histórico 2023-2025</p>
        </div>
        
        <div className="bg-[#0D4367] text-white p-6 rounded-xl shadow-lg border border-[#0B3A5C]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Crecimiento Anual</h3>
            <FaPercentage className="text-2xl" />
          </div>
          <p className="text-3xl font-bold mb-2">{estadisticasAvanzadas.crecimientoAnual}%</p>
          <p className="text-white/80 text-sm">vs 2023</p>
        </div>
        
        <div className="bg-[#0D4367] text-white p-6 rounded-xl shadow-lg border border-[#0B3A5C]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Multa Máxima</h3>
            <FaExclamationTriangle className="text-2xl" />
          </div>
          <p className="text-3xl font-bold mb-2">${estadisticasAvanzadas.maximaMulta.toLocaleString()}</p>
          <p className="text-white/80 text-sm truncate">{estadisticasAvanzadas.accionistaMayorMulta}</p>
        </div>
        
        <div className="bg-[#0D4367] text-white p-6 rounded-xl shadow-lg border border-[#0B3A5C]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Promedio Multas</h3>
            <FaChartBar className="text-2xl" />
          </div>
          <p className="text-3xl font-bold mb-2">${estadisticasAvanzadas.promedioMultas.toLocaleString()}</p>
          <p className="text-white/80 text-sm">Por accionista (2024)</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-aneupi-border-light">
        <h3 className="text-xl font-bold text-[#0D4367] mb-6">Distribución de Pagos - {selectedYearStats === "Todos" ? "Todos los años" : selectedYearStats}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-[#E8F1F7] rounded-lg border border-[#C6DFF7]">
            <div className="text-3xl font-bold text-[#0D4367] mb-2">{totalGeneral.completados}</div>
            <p className="text-[#0D4367] font-medium">Completados</p>
            <p className="text-aneupi-text-secondary text-sm">
              {totalGeneral.total > 0 
                ? `${((totalGeneral.completados / (totalGeneral.completados + totalGeneral.pendientes + totalGeneral.rechazados + totalGeneral.proceso)) * 100).toFixed(1)}%`
                : '0%'}
            </p>
          </div>
          <div className="text-center p-4 bg-[#E8F1F7] rounded-lg border border-[#C6DFF7]">
            <div className="text-3xl font-bold text-[#0D4367] mb-2">{totalGeneral.pendientes}</div>
            <p className="text-[#0D4367] font-medium">Pendientes</p>
            <p className="text-aneupi-text-secondary text-sm">
              {totalGeneral.total > 0 
                ? `${((totalGeneral.pendientes / (totalGeneral.completados + totalGeneral.pendientes + totalGeneral.rechazados + totalGeneral.proceso)) * 100).toFixed(1)}%`
                : '0%'}
            </p>
          </div>
          <div className="text-center p-4 bg-[#E8F1F7] rounded-lg border border-[#C6DFF7]">
            <div className="text-3xl font-bold text-[#0D4367] mb-2">{totalGeneral.rechazados}</div>
            <p className="text-[#0D4367] font-medium">Rechazados</p>
            <p className="text-aneupi-text-secondary text-sm">
              {totalGeneral.total > 0 
                ? `${((totalGeneral.rechazados / (totalGeneral.completados + totalGeneral.pendientes + totalGeneral.rechazados + totalGeneral.proceso)) * 100).toFixed(1)}%`
                : '0%'}
            </p>
          </div>
          <div className="text-center p-4 bg-[#E8F1F7] rounded-lg border border-[#C6DFF7]">
            <div className="text-3xl font-bold text-[#0D4367] mb-2">{totalGeneral.proceso}</div>
            <p className="text-[#0D4367] font-medium">En Proceso</p>
            <p className="text-aneupi-text-secondary text-sm">
              {totalGeneral.total > 0 
                ? `${((totalGeneral.proceso / (totalGeneral.completados + totalGeneral.pendientes + totalGeneral.rechazados + totalGeneral.proceso)) * 100).toFixed(1)}%`
                : '0%'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-aneupi-border-light">
        <h3 className="text-xl font-bold text-[#0D4367] mb-6">
          Evolución {selectedYearStats === "Todos" ? "Anual" : "Mensual"} de Pagos
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-2 border-[#0D4367]">
            <thead className="bg-aneupi-bg-tertiary">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-[#0D4367] border-b-2 border-[#0D4367]">
                  {selectedYearStats === "Todos" ? "Año" : "Mes"}
                </th>
                <th className="py-3 px-4 text-center font-semibold text-[#0D4367] border-b-2 border-[#0D4367]">Total</th>
                <th className="py-3 px-4 text-center font-semibold text-[#0D4367] border-b-2 border-[#0D4367]">Completados</th>
                <th className="py-3 px-4 text-center font-semibold text-[#0D4367] border-b-2 border-[#0D4367]">Pendientes</th>
                <th className="py-3 px-4 text-center font-semibold text-[#0D4367] border-b-2 border-[#0D4367]">Promedio</th>
                <th className="py-3 px-4 text-center font-semibold text-[#0D4367] border-b-2 border-[#0D4367]">Eficiencia</th>
              </tr>
            </thead>
            <tbody>
              {mesesArray.map((mes, index) => (
                <tr key={mes} className={index % 2 === 0 ? 'bg-white' : 'bg-aneupi-bg-tertiary'}>
                  <td className="py-3 px-4 font-medium text-[#0D4367] border-b-2 border-[#0D4367]">{mes}</td>
                  <td className="py-3 px-4 text-center border-b-2 border-[#0D4367]">
                    <span className="font-bold text-[#0D4367]">${resumenMensual[mes]?.total.toLocaleString()}</span>
                  </td>
                  <td className="py-3 px-4 text-center border-b-2 border-[#0D4367]">
                    <span className="px-3 py-1 bg-[#E8F1F7] text-[#0D4367] rounded-full text-sm border border-[#C6DFF7]">
                      {resumenMensual[mes]?.completados}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center border-b-2 border-[#0D4367]">
                    <span className="px-3 py-1 bg-[#E8F1F7] text-[#0D4367] rounded-full text-sm border border-[#C6DFF7]">
                      {resumenMensual[mes]?.pendientes}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center border-b-2 border-[#0D4367]">
                    <span className="font-medium text-[#0D4367]">${resumenMensual[mes]?.promedio?.toLocaleString()}</span>
                  </td>
                  <td className="py-3 px-4 text-center border-b-2 border-[#0D4367]">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border border-[#C6DFF7] ${
                      (resumenMensual[mes]?.completados / (resumenMensual[mes]?.completados + resumenMensual[mes]?.pendientes)) > 0.8
                        ? 'bg-[#E8F1F7] text-[#0D4367]'
                        : (resumenMensual[mes]?.completados / (resumenMensual[mes]?.completados + resumenMensual[mes]?.pendientes)) > 0.6
                        ? 'bg-[#E8F1F7] text-[#0D4367]'
                        : 'bg-[#E8F1F7] text-[#0D4367]'
                    }`}>
                      {resumenMensual[mes]?.completados > 0 
                        ? `${Math.round((resumenMensual[mes]?.completados / (resumenMensual[mes]?.completados + resumenMensual[mes]?.pendientes)) * 100)}%`
                        : '0%'
                      }
                    </span>
                  </td>
                </tr>
              ))}
              
              {/* Fila de total general */}
              <tr className="bg-[#0D4367] text-white">
                <td className="py-3 px-4 font-bold border-b-2 border-[#0D4367]">
                  TOTAL {selectedYearStats === "Todos" ? "GENERAL" : selectedYearStats}
                </td>
                <td className="py-3 px-4 text-center font-bold border-b-2 border-[#0D4367]">
                  ${totalGeneral.total.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-center font-bold border-b-2 border-[#0D4367]">
                  {totalGeneral.completados}
                </td>
                <td className="py-3 px-4 text-center font-bold border-b-2 border-[#0D4367]">
                  {totalGeneral.pendientes}
                </td>
                <td className="py-3 px-4 text-center font-bold border-b-2 border-[#0D4367]">
                  ${totalGeneral.promedio.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-center font-bold border-b-2 border-[#0D4367]">
                  {totalGeneral.completados > 0 
                    ? `${Math.round((totalGeneral.completados / (totalGeneral.completados + totalGeneral.pendientes)) * 100)}%`
                    : '0%'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EstadisticasTab;