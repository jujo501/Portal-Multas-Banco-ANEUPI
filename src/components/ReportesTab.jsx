import { useState } from "react";
import { FaFileExport, FaMoneyCheckAlt, FaChartBar, FaUser, FaDownload, FaDatabase, FaFilter, FaEye, FaFilePdf, FaFileExcel, FaFileCsv, FaCheckCircle } from "react-icons/fa";

const ReportesTab = ({ totalAccionistas = 10, pagos = [], accionistas = [], anios = [] }) => {
  const [reporteGenerando, setReporteGenerando] = useState(false);
  const [tipoReporteSeleccionado, setTipoReporteSeleccionado] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filtros, setFiltros] = useState({
    anio: "Todos",
    estado: "Todos",
    formato: "pdf"
  });
  
  const generarReporte = (tipo) => {
    setTipoReporteSeleccionado(tipo);
    setReporteGenerando(true);
    
    setTimeout(() => {
      const formato = filtros.formato.toUpperCase();
      const nombreArchivo = `Reporte_${tipo.charAt(0).toUpperCase() + tipo.slice(1)}_ANEUPI_${filtros.anio}_${new Date().toISOString().split('T')[0]}`;
      
      const blob = new Blob([`Reporte ${tipo} - Datos simulados`], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${nombreArchivo}.${formato.toLowerCase()}`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      setReporteGenerando(false);
      setTipoReporteSeleccionado(null);
    }, 2000);
  };
  
  const obtenerDatosPreview = () => {
    const pagosFiltrados = pagos.filter(p => {
      if (filtros.anio !== "Todos" && !p.fechaIngresoMulta?.includes(filtros.anio)) return false;
      if (filtros.estado !== "Todos" && p.estado !== filtros.estado) return false;
      return true;
    });
    
    return {
      totalRegistros: pagosFiltrados.length,
      totalMonto: pagosFiltrados.reduce((sum, p) => sum + p.monto, 0),
      completados: pagosFiltrados.filter(p => p.estado === "Completado").length,
      pendientes: pagosFiltrados.filter(p => p.estado === "Pendiente").length
    };
  };

  const preview = obtenerDatosPreview();
  
  const tiposReporte = [
    {
      id: "completo",
      nombre: "Reporte Completo",
      descripcion: "Documento integral con toda la información del sistema",
      contenido: ["Datos de accionistas", "Historial de multas", "Estadísticas generales", "Análisis de cumplimiento"],
      icono: <FaFileExport className="text-3xl" />
    },
    {
      id: "pagos",
      nombre: "Reporte de Pagos",
      descripcion: "Detalle completo de todas las transacciones realizadas",
      contenido: ["Pagos completados", "Pagos pendientes", "Métodos de pago", "Montos por período"],
      icono: <FaMoneyCheckAlt className="text-3xl" />
    },
    {
      id: "estadistico",
      nombre: "Reporte Estadístico",
      descripcion: "Análisis detallado con métricas y tendencias",
      contenido: ["Gráficos de tendencias", "Comparativas anuales", "Distribución de pagos", "Promedios y totales"],
      icono: <FaChartBar className="text-3xl" />
    },
    {
      id: "accionistas",
      nombre: "Reporte de Accionistas",
      descripcion: "Información completa de todos los accionistas registrados",
      contenido: ["Datos personales", "Historial de multas", "Estado de cuenta", "Información de contacto"],
      icono: <FaUser className="text-3xl" />
    }
  ];
  
  return (
    <div className="p-7">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-aneupi-primary mb-3">Generador de Reportes</h2>
        <p className="text-aneupi-text-secondary text-lg">Sistema de exportación de información - Banco ANEUPI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-aneupi-primary/20 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-aneupi-primary">Configuración de Exportación</h3>
              <button onClick={() => setShowFilters(!showFilters)} className="px-4 py-2 bg-aneupi-primary text-white rounded-lg hover:bg-aneupi-primary-dark transition-colors flex items-center gap-2">
                <FaFilter /> {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
              </button>
            </div>
            
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-aneupi-bg-tertiary rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-aneupi-primary mb-2">Año</label>
                  <select value={filtros.anio} onChange={(e) => setFiltros({...filtros, anio: e.target.value})} className="w-full px-4 py-2 border-2 border-aneupi-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-aneupi-primary">
                    <option value="Todos">Todos los años</option>
                    {anios.map(anio => <option key={anio} value={anio}>{anio}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-aneupi-primary mb-2">Estado</label>
                  <select value={filtros.estado} onChange={(e) => setFiltros({...filtros, estado: e.target.value})} className="w-full px-4 py-2 border-2 border-aneupi-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-aneupi-primary">
                    <option value="Todos">Todos</option>
                    <option value="Completado">Completado</option>
                    <option value="Pendiente">Pendiente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-aneupi-primary mb-2">Formato</label>
                  <select value={filtros.formato} onChange={(e) => setFiltros({...filtros, formato: e.target.value})} className="w-full px-4 py-2 border-2 border-aneupi-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-aneupi-primary">
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel</option>
                    <option value="csv">CSV</option>
                  </select>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tiposReporte.map(reporte => (
                <div key={reporte.id} className="bg-aneupi-bg-tertiary rounded-lg p-5 border-2 border-aneupi-primary/20 hover:border-aneupi-primary transition-all hover:shadow-md">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-white rounded-lg text-aneupi-primary border-2 border-aneupi-primary/20">
                      {reporte.icono}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-aneupi-primary text-lg mb-1">{reporte.nombre}</h4>
                      <p className="text-sm text-aneupi-text-secondary">{reporte.descripcion}</p>
                    </div>
                  </div>
                  
                  <ul className="space-y-2 mb-4">
                    {reporte.contenido.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-aneupi-text-secondary">
                        <FaCheckCircle className="text-aneupi-primary text-xs" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={() => generarReporte(reporte.id)}
                    disabled={reporteGenerando}
                    className={`w-full px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                      reporteGenerando && tipoReporteSeleccionado === reporte.id
                        ? 'bg-aneupi-primary text-white opacity-80'
                        : reporteGenerando
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-aneupi-primary text-white hover:bg-aneupi-primary-dark shadow-sm hover:shadow'
                    }`}
                  >
                    {reporteGenerando && tipoReporteSeleccionado === reporte.id ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Generando...
                      </>
                    ) : (
                      <>
                        <FaDownload />
                        Generar Reporte
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-aneupi-primary/20 mb-6 sticky top-4">
            <h3 className="text-xl font-bold text-aneupi-primary mb-4 flex items-center gap-2">
              <FaEye /> Vista Previa
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-aneupi-bg-tertiary rounded-lg border border-aneupi-primary/20">
                <p className="text-sm text-aneupi-text-muted mb-1">Total Registros</p>
                <p className="text-2xl font-bold text-aneupi-primary">{preview.totalRegistros}</p>
              </div>
              <div className="p-4 bg-aneupi-bg-tertiary rounded-lg border border-aneupi-primary/20">
                <p className="text-sm text-aneupi-text-muted mb-1">Monto Total</p>
                <p className="text-2xl font-bold text-aneupi-primary">${preview.totalMonto.toLocaleString()}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-aneupi-bg-tertiary rounded-lg border border-aneupi-primary/20">
                  <p className="text-xs text-aneupi-text-muted mb-1">Completados</p>
                  <p className="text-xl font-bold text-aneupi-primary">{preview.completados}</p>
                </div>
                <div className="p-3 bg-aneupi-bg-tertiary rounded-lg border border-aneupi-primary/20">
                  <p className="text-xs text-aneupi-text-muted mb-1">Pendientes</p>
                  <p className="text-xl font-bold text-aneupi-primary">{preview.pendientes}</p>
                </div>
              </div>
              <div className="p-4 bg-aneupi-bg-tertiary rounded-lg border border-aneupi-primary/20">
                <p className="text-sm text-aneupi-text-muted mb-2">Formato de Exportación</p>
                <div className="flex items-center gap-2 text-aneupi-primary">
                  {filtros.formato === 'pdf' && <FaFilePdf className="text-2xl" />}
                  {filtros.formato === 'excel' && <FaFileExcel className="text-2xl" />}
                  {filtros.formato === 'csv' && <FaFileCsv className="text-2xl" />}
                  <span className="font-bold text-lg">{filtros.formato.toUpperCase()}</span>
                </div>
              </div>
              <div className="p-4 bg-aneupi-bg-tertiary rounded-lg border border-aneupi-primary/20">
                <p className="text-sm text-aneupi-text-muted mb-1">Accionistas</p>
                <p className="text-xl font-bold text-aneupi-primary flex items-center gap-2">
                  <FaDatabase /> {totalAccionistas}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-aneupi-primary/20">
        <h3 className="text-xl font-bold text-aneupi-primary mb-4">Información de Reportes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-l-4 border-aneupi-primary pl-4">
            <h4 className="font-medium text-aneupi-primary mb-2">Formatos Disponibles</h4>
            <ul className="space-y-2 text-sm text-aneupi-text-secondary">
              <li className="flex items-center gap-2"><FaFilePdf className="text-aneupi-primary" /> PDF - Ideal para documentos oficiales y presentaciones</li>
              <li className="flex items-center gap-2"><FaFileExcel className="text-aneupi-primary" /> Excel - Perfecto para análisis y manipulación de datos</li>
              <li className="flex items-center gap-2"><FaFileCsv className="text-aneupi-primary" /> CSV - Compatible con múltiples sistemas y aplicaciones</li>
            </ul>
          </div>
          <div className="border-l-4 border-aneupi-primary pl-4">
            <h4 className="font-medium text-aneupi-primary mb-2">Características</h4>
            <ul className="space-y-2 text-sm text-aneupi-text-secondary">
              <li className="flex items-center gap-2"><FaCheckCircle className="text-aneupi-primary" /> Filtrado por año y estado de pago</li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-aneupi-primary" /> Vista previa de datos en tiempo real</li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-aneupi-primary" /> Descarga automática al generar</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportesTab;
