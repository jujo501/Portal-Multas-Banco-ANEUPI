import { useState } from "react";
import { FaFileExport, FaMoneyCheckAlt, FaChartBar, FaUser, FaDownload, FaDatabase, FaFilter, FaEye, FaCheckCircle } from "react-icons/fa";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ReportesTab = ({ 
  totalAccionistas, 
  pagos = [],       
  accionistas = [], 
  anios = [] 
}) => {
  const [reporteGenerando, setReporteGenerando] = useState(false);
  const [tipoReporteSeleccionado, setTipoReporteSeleccionado] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filtros, setFiltros] = useState({ anio: "Todos", estado: "Todos", formato: "pdf" });

  // --- LÓGICA DE FILTRADO (Client Side) ---
  const obtenerPagosFiltrados = () => {
    return pagos.filter(p => {
      const fecha = p.fechaRegistro || p.fechaIngresoMulta;
      const anioMatch = filtros.anio === "Todos" || (fecha && fecha.includes(filtros.anio));
      const estadoMatch = filtros.estado === "Todos" || p.estado === filtros.estado;
      return anioMatch && estadoMatch;
    });
  };

  const preview = {
    pagosFiltrados: obtenerPagosFiltrados(),
    get totalMonto() { return this.pagosFiltrados.reduce((sum, p) => sum + Number(p.monto || 0), 0); },
    get completados() { return this.pagosFiltrados.filter(p => p.estado === "Completado").length; },
    get pendientes() { return this.pagosFiltrados.filter(p => p.estado !== "Completado").length; }
  };

  // --- GENERACIÓN DE REPORTES (jsPDF) ---
  const generarReporte = (tipo) => {
    setTipoReporteSeleccionado(tipo);
    setReporteGenerando(true);
    
    setTimeout(() => {
      const doc = new jsPDF();
      const filtrados = obtenerPagosFiltrados();
      const nombreArchivo = `Reporte_${tipo.toUpperCase()}_ANEUPI_${new Date().getTime()}`;
      const fechaHoy = new Date().toLocaleDateString();

      // Encabezado Profesional
      doc.setFillColor(12, 71, 107); 
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text('BANCO ANEUPI', 105, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.text(`REPORTE DE ${tipo.toUpperCase()} - ${fechaHoy}`, 105, 30, { align: 'center' });

      // Configuración de Tabla según el tipo
      if (tipo === 'accionistas') {
        autoTable(doc, {
          startY: 50,
          head: [['ID', 'Nombre', 'Código', 'Email', 'Estado']],
          body: accionistas.map(a => [a.id, a.nombre, a.codigo, a.email, a.estado]),
          theme: 'striped',
          headStyles: { fillColor: [12, 71, 107] }
        });
      } else {
        // Reporte de Pagos / Estadístico / Completo
        autoTable(doc, {
          startY: 50,
          head: [['ID', 'Accionista', 'Fecha', 'Monto', 'Estado', 'Descripción']],
          body: filtrados.map(p => [
            p.id,
            p.accionista?.nombre || 'N/A',
            (p.fechaRegistro || p.fechaIngresoMulta)?.split('T')[0],
            `$${Number(p.monto).toLocaleString()}`,
            p.estado,
            p.descripcion
          ]),
          theme: 'striped',
          headStyles: { fillColor: [12, 71, 107] },
          foot: [['', '', 'TOTAL', `$${preview.totalMonto.toLocaleString()}`, '', '']]
        });
      }

      // Pie de página
      const pageCount = doc.internal.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text('Sistema de Gestión de Multas - Banco ANEUPI', 105, 285, { align: 'center' });
      }

      doc.save(`${nombreArchivo}.pdf`);
      setReporteGenerando(false);
      setTipoReporteSeleccionado(null);
    }, 1500); 
  };

  const tiposReporte = [
    {
      id: "completo",
      nombre: "Reporte Completo",
      descripcion: "Documento integral con toda la información filtrada.",
      contenido: ["Resumen ejecutivo", "Análisis de accionistas", "Métricas de cumplimiento"],
      icono: <FaFileExport className="text-3xl" />
    },
    {
      id: "pagos",
      nombre: "Reporte de Pagos",
      descripcion: "Detalle completo de todos los pagos realizados.",
      contenido: ["Pagos completados con días de proceso", "Pagos pendientes con prioridad"],
      icono: <FaMoneyCheckAlt className="text-3xl" />
    },
    {
      id: "estadistico",
      nombre: "Reporte Estadístico",
      descripcion: "Análisis detallado con métricas y tendencias.",
      contenido: ["Tendencias con variación anual", "Análisis de eficiencia"],
      icono: <FaChartBar className="text-3xl" />
    },
    {
      id: "accionistas",
      nombre: "Reporte de Accionistas",
      descripcion: "Información completa de todos los accionistas registrados.",
      contenido: ["Datos personales", "Estado de cuenta con saldos"],
      icono: <FaUser className="text-3xl" />
    }
  ];

  return (
    <div className="p-7">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-aneupi-primary mb-2">Generador de Reportes</h2>
          <p className="text-aneupi-text-secondary text-lg">Sistema de exportación de información - Banco ANEUPI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Lado Izquierdo: Configuración */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-aneupi-primary/20 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-aneupi-primary">Configuración de Exportación</h3>
              <button onClick={() => setShowFilters(!showFilters)} className="px-4 py-2 bg-aneupi-primary text-white rounded-lg flex items-center gap-2 shadow-md hover:bg-aneupi-primary-dark transition">
                <FaFilter /> {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
              </button>
            </div>
            
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-aneupi-bg-tertiary rounded-lg border-2 border-aneupi-primary/10">
                <div>
                  <label className="block text-sm font-bold text-aneupi-primary mb-2">Año</label>
                  <select value={filtros.anio} onChange={(e) => setFiltros({...filtros, anio: e.target.value})} className="w-full px-4 py-2 border-2 border-aneupi-primary/20 rounded-lg">
                    <option value="Todos">Todos los años</option>
                    {anios.map(anio => <option key={anio} value={anio}>{anio}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-aneupi-primary mb-2">Estado</label>
                  <select value={filtros.estado} onChange={(e) => setFiltros({...filtros, estado: e.target.value})} className="w-full px-4 py-2 border-2 border-aneupi-primary/20 rounded-lg">
                    <option value="Todos">Todos</option>
                    <option value="Completado">Completado</option>
                    <option value="Pendiente">Pendiente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-aneupi-primary mb-2">Formato</label>
                  <select value={filtros.formato} onChange={(e) => setFiltros({...filtros, formato: e.target.value})} className="w-full px-4 py-2 border-2 border-aneupi-primary/20 rounded-lg">
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel</option>
                  </select>
                </div>
              </div>
            )}

            {/* Cuadrícula de Reportes (Los 4 tipos) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tiposReporte.map(reporte => (
                <div key={reporte.id} className="bg-aneupi-bg-tertiary rounded-xl p-5 border-2 border-aneupi-primary/10 hover:border-aneupi-primary transition-all group hover:shadow-lg cursor-pointer">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-white rounded-lg text-aneupi-primary border-2 border-aneupi-primary/10 group-hover:border-aneupi-primary transition-colors">
                      {reporte.icono}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-aneupi-primary text-lg mb-1">{reporte.nombre}</h4>
                      <p className="text-sm text-aneupi-text-secondary leading-tight">{reporte.descripcion}</p>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-5">
                    {reporte.contenido.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-aneupi-text-secondary font-medium">
                        <FaCheckCircle className="text-aneupi-primary" /> {item}
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => generarReporte(reporte.id)}
                    disabled={reporteGenerando}
                    className="w-full py-3 bg-aneupi-primary text-white rounded-lg font-bold hover:bg-aneupi-primary-dark transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    {reporteGenerando && tipoReporteSeleccionado === reporte.id ? 'Generando...' : <><FaDownload /> Generar Reporte</>}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lado Derecho: Vista Previa */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-aneupi-primary/20 sticky top-4">
            <h3 className="text-xl font-bold text-aneupi-primary mb-6 flex items-center gap-2">
              <FaEye /> Vista Previa Real
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-aneupi-bg-tertiary rounded-xl border border-aneupi-primary/10">
                <p className="text-sm text-aneupi-text-muted mb-1 font-bold">Registros Filtrados</p>
                <p className="text-2xl font-black text-aneupi-primary">{preview.pagosFiltrados.length}</p>
              </div>
              <div className="p-5 bg-aneupi-primary text-white rounded-xl shadow-inner border-2 border-aneupi-primary-dark">
                <p className="text-sm opacity-80 mb-1">Monto Total</p>
                <p className="text-3xl font-black">${preview.totalMonto.toLocaleString()}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-aneupi-bg-tertiary rounded-xl border border-aneupi-primary/10">
                  <p className="text-xs text-aneupi-text-muted mb-1 font-bold">Completados</p>
                  <p className="text-xl font-bold text-green-600">{preview.completados}</p>
                </div>
                <div className="p-3 bg-aneupi-bg-tertiary rounded-xl border border-aneupi-primary/10">
                  <p className="text-xs text-aneupi-text-muted mb-1 font-bold">Pendientes</p>
                  <p className="text-xl font-bold text-yellow-600">{preview.pendientes}</p>
                </div>
              </div>
              <div className="p-4 bg-aneupi-bg-tertiary rounded-xl border border-aneupi-primary/10 flex items-center justify-between">
                <span className="text-sm text-aneupi-text-muted font-bold">Base de Datos</span>
                <span className="text-xl font-black text-aneupi-primary flex items-center gap-2">
                  <FaDatabase className="text-sm" /> {totalAccionistas}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportesTab;