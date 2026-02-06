import { useState, useEffect } from "react";
import { FaDollarSign, FaCheckCircle, FaClock, FaChartBar, FaEye, FaEyeSlash, FaCog, FaGripVertical, FaDatabase } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const EstadisticasTab = ({ 
  selectedYearStats, 
  setSelectedYearStats, 
  resumenMensual, 
  estadisticasAvanzadas,
  totalAccionistas,
  pagos, // Mock data
  anios
}) => {
  const [widgets, setWidgets] = useState(() => {
    const saved = localStorage.getItem('estadisticas-widgets-order');
    return saved ? JSON.parse(saved) : [
      { id: 'pie', name: 'Distribución de Pagos', visible: true },
      { id: 'line', name: 'Evolución Temporal', visible: true },
      { id: 'bar', name: 'Recaudación por Estado', visible: true },
      { id: 'table', name: 'Tabla Detallada', visible: true }
    ];
  });
  
  const [showConfig, setShowConfig] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // --- ESTADOS PARA DATOS REALES DEL BACKEND ---
  const [pagosReales, setPagosReales] = useState([]);
  const [usarDatosReales, setUsarDatosReales] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/api/pagos')
      .then(res => res.json())
      .then(data => setPagosReales(Array.isArray(data) ? data : []))
      .catch(err => console.error(" Error cargando estadísticas reales:", err));
  }, []);

  useEffect(() => {
    localStorage.setItem('estadisticas-widgets-order', JSON.stringify(widgets));
  }, [widgets]);

  
  const fuenteDeDatos = usarDatosReales ? pagosReales : (pagos || []);

  const pagosFiltradosPorAnio = fuenteDeDatos.filter(p => {
    if (selectedYearStats === "Todos") return true;
    const fechaStr = p.fechaRegistro || p.fechaIngresoMulta;
    return fechaStr && fechaStr.includes(selectedYearStats);
  });
  
  
  const totalRecaudadoReal = pagosFiltradosPorAnio.reduce((sum, p) => sum + Number(p.monto || 0), 0);
  const completadosReal = pagosFiltradosPorAnio.filter(p => p.estado === "Completado").length;
  const pendientesReal = pagosFiltradosPorAnio.filter(p => p.estado === "Pendiente" || p.estado === "En_proceso").length;
  const totalPagosReal = completadosReal + pendientesReal;
  const promedioReal = totalPagosReal > 0 ? Math.round(totalRecaudadoReal / totalPagosReal) : 0;
  const tasaCumplimientoReal = totalPagosReal > 0 ? Math.round((completadosReal / totalPagosReal) * 100) : 0;
  const montoPendienteReal = pagosFiltradosPorAnio.filter(p => p.estado !== "Completado").reduce((sum, p) => sum + Number(p.monto || 0), 0);
  
  const pagosPorMes = {};
  const mesesNombres = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  pagosFiltradosPorAnio.forEach(pago => {
    const fechaRaw = pago.fechaRegistro || pago.fechaIngresoMulta;
    if (!fechaRaw) return;
    
    const fecha = new Date(fechaRaw);
    const anio = fecha.getFullYear();
    const mesNombre = mesesNombres[fecha.getMonth()];
    
    const clave = selectedYearStats === "Todos" ? anio.toString() : mesNombre;
    
    if (!pagosPorMes[clave]) {
      pagosPorMes[clave] = { total: 0, completados: 0, pendientes: 0, count: 0 };
    }
    pagosPorMes[clave].total += Number(pago.monto || 0);
    pagosPorMes[clave].count++;
    if (pago.estado === "Completado") pagosPorMes[clave].completados++;
    else pagosPorMes[clave].pendientes++;
  });
  
  const mesesArray = Object.keys(pagosPorMes).sort((a, b) => {
    if (selectedYearStats === "Todos") return a.localeCompare(b);
    return mesesNombres.indexOf(a) - mesesNombres.indexOf(b);
  });

  const COLORS = ['#0c476b', '#f59e0b'];

  const toggleVisibility = (id) => {
    setWidgets(widgets.map(w => w.id === id ? { ...w, visible: !w.visible } : w));
  };

  const handleDragStart = (index) => setDraggedIndex(index);
  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newWidgets = [...widgets];
    const draggedWidget = newWidgets[draggedIndex];
    newWidgets.splice(draggedIndex, 1);
    newWidgets.splice(index, 0, draggedWidget);
    setWidgets(newWidgets);
    setDraggedIndex(index);
  };
  const handleDragEnd = () => setDraggedIndex(null);

  const renderWidget = (widget) => {
    if (!widget.visible) return null;

    switch (widget.id) {
      case 'pie':
        return (
          <div key={widget.id} draggable onDragStart={() => handleDragStart(widgets.indexOf(widget))} onDragOver={(e) => handleDragOver(e, widgets.indexOf(widget))} onDragEnd={handleDragEnd} className="bg-white rounded-xl shadow-lg p-6 border-2 border-aneupi-primary/20 cursor-move">
            <div className="flex items-center gap-2 mb-6">
              <FaGripVertical className="text-aneupi-primary/40" />
              <h3 className="text-xl font-bold text-aneupi-primary">Distribución de Pagos</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={[{ name: 'Completados', value: completadosReal }, { name: 'Pendientes', value: pendientesReal }]} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={100} fill="#8884d8" dataKey="value">
                  {[{ name: 'C' }, { name: 'P' }].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'line':
        return (
          <div key={widget.id} draggable onDragStart={() => handleDragStart(widgets.indexOf(widget))} onDragOver={(e) => handleDragOver(e, widgets.indexOf(widget))} onDragEnd={handleDragEnd} className="bg-white rounded-xl shadow-lg p-6 border-2 border-aneupi-primary/20 cursor-move">
            <div className="flex items-center gap-2 mb-6">
              <FaGripVertical className="text-aneupi-primary/40" />
              <h3 className="text-xl font-bold text-aneupi-primary">{selectedYearStats === "Todos" ? "Evolución Anual" : "Evolución Mensual"}</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mesesArray.map(p => ({ periodo: p, monto: pagosPorMes[p]?.total || 0 }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periodo" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Line type="monotone" dataKey="monto" stroke="#0c476b" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'bar':
        return (
          <div key={widget.id} draggable onDragStart={() => handleDragStart(widgets.indexOf(widget))} onDragOver={(e) => handleDragOver(e, widgets.indexOf(widget))} onDragEnd={handleDragEnd} className="bg-white rounded-xl shadow-lg p-6 border-2 border-aneupi-primary/20 cursor-move lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <FaGripVertical className="text-aneupi-primary/40" />
              <h3 className="text-xl font-bold text-aneupi-primary">Recaudación por Estado</h3>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={mesesArray.map(p => ({ periodo: p, Completados: pagosPorMes[p]?.completados || 0, Pendientes: pagosPorMes[p]?.pendientes || 0 }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periodo" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Completados" fill="#0c476b" />
                <Bar dataKey="Pendientes" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'table':
        return (
          <div key={widget.id} draggable onDragStart={() => handleDragStart(widgets.indexOf(widget))} onDragOver={(e) => handleDragOver(e, widgets.indexOf(widget))} onDragEnd={handleDragEnd} className="bg-white rounded-xl shadow-lg p-6 border-2 border-aneupi-primary/20 cursor-move lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <FaGripVertical className="text-aneupi-primary/40" />
              <h3 className="text-xl font-bold text-aneupi-primary">Resumen Detallado</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-2 border-aneupi-primary">
                <thead className="bg-aneupi-bg-tertiary">
                  <tr>
                    <th className="py-3 px-4 text-left text-aneupi-primary border-b-2 border-aneupi-primary">{selectedYearStats === "Todos" ? "Año" : "Mes"}</th>
                    <th className="py-3 px-4 text-center text-aneupi-primary border-b-2 border-aneupi-primary">Total</th>
                    <th className="py-3 px-4 text-center text-aneupi-primary border-b-2 border-aneupi-primary">Eficiencia</th>
                  </tr>
                </thead>
                <tbody>
                  {mesesArray.map((m, i) => {
                    const d = pagosPorMes[m];
                    const ef = d.count > 0 ? Math.round((d.completados / d.count) * 100) : 0;
                    return (
                      <tr key={m} className={i % 2 === 0 ? 'bg-white' : 'bg-aneupi-bg-tertiary'}>
                        <td className="py-3 px-4 border-b-2 border-aneupi-primary">{m}</td>
                        <td className="py-3 px-4 text-center border-b-2 border-aneupi-primary font-bold">${d.total.toLocaleString()}</td>
                        <td className="py-3 px-4 text-center border-b-2 border-aneupi-primary">{ef}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="p-7">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-aneupi-primary mb-2">Estadísticas Avanzadas - Sistema ANEUPI</h2>
            <p className="text-aneupi-text-secondary">
              Análisis ({usarDatosReales ? 'Base de Datos' : 'Simulado'}) - {totalAccionistas} accionistas
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setUsarDatosReales(!usarDatosReales)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all border shadow-sm ${
                usarDatosReales ? 'bg-green-600 border-green-400 text-white' : 'bg-white/10 border-aneupi-primary/20 text-aneupi-primary'
              }`}
            >
              <FaDatabase className={usarDatosReales ? 'animate-pulse' : ''} />
              {usarDatosReales ? "MODO REAL" : "MODO MOCK"}
            </button>

            <button onClick={() => setShowConfig(!showConfig)} className="px-4 py-2 bg-aneupi-primary text-white rounded-lg hover:bg-aneupi-primary-dark flex items-center gap-2">
              <FaCog /> Configurar
            </button>
            <select value={selectedYearStats} onChange={(e) => setSelectedYearStats(e.target.value)} className="px-4 py-2 border-2 border-aneupi-primary/20 rounded-lg bg-white text-aneupi-primary">
              <option value="Todos">Todos los años</option>
              {anios && anios.map(anio => <option key={anio} value={anio}>{anio}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-aneupi-primary text-white p-6 rounded-xl shadow-lg border-2 border-aneupi-primary-dark">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Total Recaudado</h3>
            <FaDollarSign className="text-2xl" />
          </div>
          <p className="text-3xl font-bold mb-2">${totalRecaudadoReal.toLocaleString()}</p>
          <p className="text-white/80 text-sm">{selectedYearStats === "Todos" ? "Histórico" : selectedYearStats}</p>
        </div>
        
        <div className="bg-aneupi-primary text-white p-6 rounded-xl shadow-lg border-2 border-aneupi-primary-dark">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Tasa Cumplimiento</h3>
            <FaCheckCircle className="text-2xl" />
          </div>
          <p className="text-3xl font-bold mb-2">{tasaCumplimientoReal}%</p>
          <p className="text-white/80 text-sm">{completadosReal} de {totalPagosReal} pagos</p>
        </div>
        
        <div className="bg-aneupi-primary text-white p-6 rounded-xl shadow-lg border-2 border-aneupi-primary-dark">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Monto Pendiente</h3>
            <FaClock className="text-2xl" />
          </div>
          <p className="text-3xl font-bold mb-2">${montoPendienteReal.toLocaleString()}</p>
          <p className="text-white/80 text-sm">{pendientesReal} multas pendientes</p>
        </div>
        
        <div className="bg-aneupi-primary text-white p-6 rounded-xl shadow-lg border-2 border-aneupi-primary-dark">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Promedio por Multa</h3>
            <FaChartBar className="text-2xl" />
          </div>
          <p className="text-3xl font-bold mb-2">${promedioReal.toLocaleString()}</p>
          <p className="text-white/80 text-sm">Basado en {totalPagosReal} multas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {widgets.map(widget => renderWidget(widget))}
      </div>
    </div>
  );
};

export default EstadisticasTab;