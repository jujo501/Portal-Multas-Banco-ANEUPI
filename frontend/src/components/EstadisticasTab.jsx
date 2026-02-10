import { useState, useEffect } from "react";
import { FaDollarSign, FaCheckCircle, FaClock, FaChartBar, FaCog, FaGripVertical } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const EstadisticasTab = ({ 
  selectedYearStats, 
  setSelectedYearStats, 
  totalAccionistas,
  pagos = [], 
  anios
}) => {
  
  // --- CONFIGURACIÓN DE WIDGETS (Persistencia LocalStorage) ---
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

  useEffect(() => {
    localStorage.setItem('estadisticas-widgets-order', JSON.stringify(widgets));
  }, [widgets]);

  // --- CÁLCULOS DE ESTADÍSTICAS (Basados en Datos Reales) ---
  
  // 1. Filtrar por Año seleccionado
  const pagosFiltrados = pagos.filter(p => {
    if (selectedYearStats === "Todos") return true;
    const fechaStr = p.fechaRegistro || p.fechaIngresoMulta;
    return fechaStr && fechaStr.includes(selectedYearStats);
  });
  
  // 2. Métricas Generales (Cards Superiores)
  const totalRecaudado = pagosFiltrados.reduce((sum, p) => sum + Number(p.monto || 0), 0);
  const completados = pagosFiltrados.filter(p => p.estado === "Completado").length;
  const pendientes = pagosFiltrados.filter(p => p.estado !== "Completado").length; // Incluye Pendiente, En_proceso, Rechazado
  const totalPagos = pagosFiltrados.length;
  
  const promedio = totalPagos > 0 ? Math.round(totalRecaudado / totalPagos) : 0;
  const tasaCumplimiento = totalPagos > 0 ? Math.round((completados / totalPagos) * 100) : 0;
  
  const montoPendiente = pagosFiltrados
    .filter(p => p.estado !== "Completado")
    .reduce((sum, p) => sum + Number(p.monto || 0), 0);
  
  // 3. Agrupación por Mes (Para Gráficas)
  const pagosPorMes = {};
  const mesesNombres = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  pagosFiltrados.forEach(pago => {
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
  
  // Ordenar Ejes Cronológicamente
  const ejesOrdenados = Object.keys(pagosPorMes).sort((a, b) => {
    if (selectedYearStats === "Todos") return a.localeCompare(b); 
    return mesesNombres.indexOf(a) - mesesNombres.indexOf(b); 
  });

  const COLORS = ['#0c476b', '#f59e0b'];

  // --- ARRASTRAR Y SOLTAR (Drag & Drop) ---
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

  // --- RENDERIZADO DE WIDGETS ---
  const renderWidget = (widget) => {
    if (!widget.visible) return null;

    const commonClasses = "bg-white rounded-xl shadow-lg p-6 border-2 border-aneupi-primary/20 cursor-move";

    switch (widget.id) {
      case 'pie':
        return (
          <div key={widget.id} draggable onDragStart={() => handleDragStart(widgets.indexOf(widget))} onDragOver={(e) => handleDragOver(e, widgets.indexOf(widget))} onDragEnd={handleDragEnd} className={commonClasses}>
            <div className="flex items-center gap-2 mb-6">
              <FaGripVertical className="text-aneupi-primary/40" />
              <h3 className="text-xl font-bold text-aneupi-primary">Distribución de Pagos</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
                    data={[{ name: 'Completados', value: completados }, { name: 'Pendientes', value: pendientes }]} 
                    cx="50%" cy="50%" 
                    labelLine={false} 
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} 
                    outerRadius={100} 
                    fill="#8884d8" 
                    dataKey="value"
                >
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
          <div key={widget.id} draggable onDragStart={() => handleDragStart(widgets.indexOf(widget))} onDragOver={(e) => handleDragOver(e, widgets.indexOf(widget))} onDragEnd={handleDragEnd} className={commonClasses}>
            <div className="flex items-center gap-2 mb-6">
              <FaGripVertical className="text-aneupi-primary/40" />
              <h3 className="text-xl font-bold text-aneupi-primary">{selectedYearStats === "Todos" ? "Evolución Anual" : "Evolución Mensual"}</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ejesOrdenados.map(p => ({ periodo: p, monto: pagosPorMes[p]?.total || 0 }))}>
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
          <div key={widget.id} draggable onDragStart={() => handleDragStart(widgets.indexOf(widget))} onDragOver={(e) => handleDragOver(e, widgets.indexOf(widget))} onDragEnd={handleDragEnd} className={`${commonClasses} lg:col-span-2`}>
            <div className="flex items-center gap-2 mb-6">
              <FaGripVertical className="text-aneupi-primary/40" />
              <h3 className="text-xl font-bold text-aneupi-primary">Recaudación por Estado</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ejesOrdenados.map(p => ({ periodo: p, Completados: pagosPorMes[p]?.completados || 0, Pendientes: pagosPorMes[p]?.pendientes || 0 }))}>
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
          <div key={widget.id} draggable onDragStart={() => handleDragStart(widgets.indexOf(widget))} onDragOver={(e) => handleDragOver(e, widgets.indexOf(widget))} onDragEnd={handleDragEnd} className={`${commonClasses} lg:col-span-2`}>
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
                  {ejesOrdenados.map((m, i) => {
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
            <h2 className="text-2xl font-bold text-aneupi-primary mb-2">Estadísticas Avanzadas</h2>
            <p className="text-aneupi-text-secondary">
              Análisis de {totalAccionistas} accionistas (Datos Reales)
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={() => setShowConfig(!showConfig)} className="px-4 py-2 bg-aneupi-primary text-white rounded-lg hover:bg-aneupi-primary-dark flex items-center gap-2 shadow-md transition-all">
              <FaCog /> Configurar
            </button>
            <select value={selectedYearStats} onChange={(e) => setSelectedYearStats(e.target.value)} className="px-4 py-2 border-2 border-aneupi-primary/20 rounded-lg bg-white text-aneupi-primary focus:outline-none focus:border-aneupi-primary">
              <option value="Todos">Todos los años</option>
              {(anios || []).map(anio => <option key={anio} value={anio}>{anio}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* TARJETAS SUPERIORES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-aneupi-primary text-white p-6 rounded-xl shadow-lg border-2 border-aneupi-primary-dark hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium opacity-90">Total Recaudado</h3>
            <FaDollarSign className="text-2xl opacity-70" />
          </div>
          <p className="text-3xl font-bold mb-2">${totalRecaudado.toLocaleString()}</p>
          <p className="text-white/60 text-sm font-mono">{selectedYearStats === "Todos" ? "Histórico Global" : `Año ${selectedYearStats}`}</p>
        </div>
        
        <div className="bg-aneupi-primary text-white p-6 rounded-xl shadow-lg border-2 border-aneupi-primary-dark hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium opacity-90">Tasa Cumplimiento</h3>
            <FaCheckCircle className="text-2xl opacity-70" />
          </div>
          <p className="text-3xl font-bold mb-2">{tasaCumplimiento}%</p>
          <p className="text-white/60 text-sm font-mono">{completados} pagados / {totalPagos} emitidos</p>
        </div>
        
        <div className="bg-aneupi-primary text-white p-6 rounded-xl shadow-lg border-2 border-aneupi-primary-dark hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium opacity-90">Monto Pendiente</h3>
            <FaClock className="text-2xl opacity-70" />
          </div>
          <p className="text-3xl font-bold mb-2">${montoPendiente.toLocaleString()}</p>
          <p className="text-white/60 text-sm font-mono">{pendientes} multas por cobrar</p>
        </div>
        
        <div className="bg-aneupi-primary text-white p-6 rounded-xl shadow-lg border-2 border-aneupi-primary-dark hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium opacity-90">Promedio por Multa</h3>
            <FaChartBar className="text-2xl opacity-70" />
          </div>
          <p className="text-3xl font-bold mb-2">${promedio.toLocaleString()}</p>
          <p className="text-white/60 text-sm font-mono">Basado en {totalPagos} registros</p>
        </div>
      </div>

      {/* WIDGETS ARRANGABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {widgets.map(widget => renderWidget(widget))}
      </div>
    </div>
  );
};

export default EstadisticasTab;