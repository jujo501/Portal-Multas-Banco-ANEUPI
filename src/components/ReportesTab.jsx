import { useState } from "react";
import { FaFileExport, FaMoneyCheckAlt, FaChartBar, FaUser, FaDownload, FaDatabase } from "react-icons/fa";

const ReportesTab = ({ totalAccionistas = 10 }) => {
  const [reporteGenerando, setReporteGenerando] = useState(false);
  const [tipoReporteSeleccionado, setTipoReporteSeleccionado] = useState(null);
  
  const generarReporte = (tipo) => {
    setTipoReporteSeleccionado(tipo);
    setReporteGenerando(true);
    
    setTimeout(() => {
      const formatos = {
        'completo': 'PDF',
        'pagos': 'Excel',
        'estadistico': 'PDF',
        'accionistas': 'Excel'
      };
      
      const formato = formatos[tipo];
      const nombreArchivo = `Reporte_${tipo.charAt(0).toUpperCase() + tipo.slice(1)}_ANEUPI_${new Date().toISOString().split('T')[0]}`;
      
      alert(`Reporte ${tipo} generado exitosamente en formato ${formato}.\n📁 Archivo: ${nombreArchivo}.${formato.toLowerCase()}\n⬇️ La descarga comenzará automáticamente.`);
      setReporteGenerando(false);
      
      setTimeout(() => {
        alert('📥 Descarga completada. Revisa tu carpeta de descargas.');
        setTipoReporteSeleccionado(null);
      }, 1000);
    }, 2000);
  };
  
  const tiposReporte = [
    {
      id: "completo",
      nombre: "Reporte Completo",
      descripcion: "Todos los datos del sistema",
      contenido: `Incluye: ${totalAccionistas} accionistas, multas 2023-2025, pagos 2024, estadísticas`,
      formato: "PDF",
      icono: <FaFileExport className="text-2xl text-[#0D4367]" />
    },
    {
      id: "pagos",
      nombre: "Reporte de Pagos",
      descripcion: "Detalle de transacciones",
      contenido: "Incluye: Pagos, estados, métodos, montos por mes",
      formato: "Excel",
      icono: <FaMoneyCheckAlt className="text-2xl text-[#0D4367]" />
    },
    {
      id: "estadistico",
      nombre: "Reporte Estadístico",
      descripcion: "Análisis y métricas",
      contenido: "Incluye: Tendencias, comparativas, distribución, promedios",
      formato: "PDF",
      icono: <FaChartBar className="text-2xl text-[#0D4367]" />
    },
    {
      id: "accionistas",
      nombre: "Reporte de Accionistas",
      descripcion: "Datos completos de accionistas",
      contenido: "Incluye: Información personal, multas, historial de pagos",
      formato: "Excel",
      icono: <FaUser className="text-2xl text-[#0D4367]" />
    }
  ];
  
  return (
    <div className="p-7">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#0D4367] mb-4">Generador de Reportes - ANEUPI</h2>
        <p className="text-aneupi-text-secondary">Exporte información detallada del sistema</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {tiposReporte.map(reporte => (
          <div 
            key={reporte.id}
            className={`bg-white rounded-xl shadow-lg p-6 border border-aneupi-border-light hover:shadow-xl transition-shadow hover:border-[#0D4367] ${
              reporteGenerando && tipoReporteSeleccionado === reporte.id ? 'ring-1 ring-[#0D4367]' : ''
            }`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-[#E8F1F7] rounded-lg border border-[#C6DFF7]">
                {reporte.icono}
              </div>
              <div>
                <h3 className="font-bold text-[#0D4367]">{reporte.nombre}</h3>
                <p className="text-sm text-aneupi-text-secondary">{reporte.descripcion}</p>
              </div>
            </div>
            <p className="text-aneupi-text-secondary mb-4">{reporte.contenido}</p>
            <button 
              onClick={() => generarReporte(reporte.id)}
              disabled={reporteGenerando}
              className={`w-full px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                reporteGenerando && tipoReporteSeleccionado === reporte.id
                  ? 'bg-[#0D4367] text-white opacity-80'
                  : reporteGenerando
                  ? 'bg-[#F0F1F5] text-aneupi-text-muted cursor-not-allowed'
                  : 'bg-[#0D4367] text-white hover:bg-[#0B3A5C] shadow-sm hover:shadow'
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
                  Generar {reporte.formato} ({reporte.id === 'pagos' || reporte.id === 'accionistas' ? 'Excel' : 'PDF'})
                </>
              )}
            </button>
            <div className="mt-4 flex items-center justify-between text-xs text-aneupi-text-muted">
              <span className="flex items-center gap-1">
                <FaDatabase className="text-[#0D4367]" /> Incluye {totalAccionistas} accionistas
              </span>
              <span className="px-2 py-1 bg-[#E8F1F7] text-[#0D4367] rounded border border-[#C6DFF7]">
                {reporte.formato}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6 border border-aneupi-border-light">
        <h3 className="text-xl font-bold text-[#0D4367] mb-4">Instrucciones de Uso</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="border-l-4 border-[#0D4367] pl-4">
            <h4 className="font-medium text-[#0D4367] mb-2">Reporte Completo</h4>
            <p className="text-sm text-aneupi-text-secondary">
              Genera un documento PDF con toda la información del sistema, ideal para auditorías o revisiones anuales.
            </p>
          </div>
          <div className="border-l-4 border-[#0D4367] pl-4">
            <h4 className="font-medium text-[#0D4367] mb-2">Reporte de Pagos</h4>
            <p className="text-sm text-aneupi-text-secondary">
              Crea una hoja de cálculo Excel con detalles de transacciones, filtrable y ordenable por múltiples criterios.
            </p>
          </div>
          <div className="border-l-4 border-[#0D4367] pl-4">
            <h4 className="font-medium text-[#0D4367] mb-2">Reporte Estadístico</h4>
            <p className="text-sm text-aneupi-text-secondary">
              Produce un análisis PDF con gráficas y métricas para presentaciones ejecutivas y toma de decisiones.
            </p>
          </div>
          <div className="border-l-4 border-[#0D4367] pl-4">
            <h4 className="font-medium text-[#0D4367] mb-2">Reporte de Accionistas</h4>
            <p className="text-sm text-aneupi-text-secondary">
              Exporta todos los datos de los {totalAccionistas} accionistas en formato Excel para análisis externos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportesTab;