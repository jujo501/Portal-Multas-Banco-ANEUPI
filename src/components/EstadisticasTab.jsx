import { useState, useEffect } from "react";
import { FaDollarSign, FaCheckCircle, FaClock, FaChartBar, FaEye, FaEyeSlash, FaCog, FaGripVertical } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const EstadisticasTab = ({ 
  selectedYearStats, 
  setSelectedYearStats, 
  resumenMensual, 
  estadisticasAvanzadas,
  totalAccionistas,
  pagos,
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

  useEffect(() => {
    localStorage.setItem('estadisticas-widgets-order', JSON.stringify(widgets));
  }, [widgets]);

  const pagosFiltradosPorAnio = pagos ? pagos.filter(p => {
    if (selectedYearStats === "Todos") return true;
    return p.fechaIngresoMulta && p.fechaIngresoMulta.includes(selectedYearStats);
  }) : [];
  
  const totalRecaudadoReal = pagosFiltradosPorAnio.reduce((sum, p) => sum + p.monto, 0);
  const completadosReal = pagosFiltradosPorAnio.filter(p => p.estado === "Completado").length;
  const pendientesReal = pagosFiltradosPorAnio.filter(p => p.estado === "Pendiente").length;
  const totalPagosReal = completadosReal + pendientesReal;
  const promedioReal = totalPagosReal > 0 ? Math.round(totalRecaudadoReal / totalPagosReal) : 0;
  const tasaCumplimientoReal = totalPagosReal > 0 ? Math.round((completadosReal / totalPagosReal) * 100) : 0;
  const montoPendienteReal = pagosFiltradosPorAnio.filter(p => p.estado === "Pendiente").reduce((sum, p) => sum + p.monto, 0);
  
  const pagosPorMes = {};
  if (selectedYearStats === "Todos") {
    pagosFiltradosPorAnio.forEach(pago => {
      const anio = pago.fechaIngresoMulta ? pago.fechaIngresoMulta.split('-')[0] : null;
      if (!anio) return;
      if (!pagosPorMes[anio]) {
        pagosPorMes[anio] = { total: 0, completados: 0, pendientes: 0, count: 0 };
      }
      pagosPorMes[anio].total += pago.monto;
      pagosPorMes[anio].count++;
      if (pago.estado === "Completado") pagosPorMes[anio].completados++;
      if (pago.estado === "Pendiente") pagosPorMes[anio].pendientes++;
    });
  } else {
    pagosFiltradosPorAnio.forEach(pago => {
      if (!pago.fechaIngresoMulta) return;
      const [anio, mes] = pago.fechaIngresoMulta.split('-');
      const mesesNombres = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
      const mesNombre = mesesNombres[parseInt(mes) - 1];
      const claveMes = `${mesNombre} ${anio}`;
      
      if (!pagosPorMes[claveMes]) {
        pagosPorMes[claveMes] = { total: 0, completados: 0, pendientes: 0, count: 0 };
      }
      pagosPorMes[claveMes].total += pago.monto;
      pagosPorMes[claveMes].count++;
      if (pago.estado === "Completado") pagosPorMes[claveMes].completados++;
      if (pago.estado === "Pendiente") pagosPorMes[claveMes].pendientes++;
    });
  }
  
  Object.keys(pagosPorMes).forEach(mes => {
    const totalPagosMes = pagosPorMes[mes].completados + pagosPorMes[mes].pendientes;
    pagosPorMes[mes].promedio = totalPagosMes > 0 
      ? Math.round(pagosPorMes[mes].total / totalPagosMes) 
      : 0;
  });
  
  const mesesArray = Object.keys(pagosPorMes).sort((a, b) => {
    if (selectedYearStats === "Todos") {
      return a.localeCompare(b);
    } else {
      const mesesOrden = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
      const [mesA, anioA] = a.split(' ');
      const [mesB, anioB] = b.split(' ');
      if (anioA !== anioB) return anioA.localeCompare(anioB);
      return mesesOrden.indexOf(mesA) - mesesOrden.indexOf(mesB);
    }
  });

  const COLORS = ['#0c476b', '#f59e0b'];

  const toggleVisibility = (id) => {
    setWidgets(widgets.map(w => w.id === id ? { ...w, visible: !w.visible } : w));
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

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

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

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
                <Pie data={[{ name: 'Completados', value: completadosReal }, { name: 'Pendientes', value: pendientesReal }]} cx="50%" cy="50%" labelLine={false} label={({ name, percent, value }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`} outerRadius={100} fill="#8884d8" dataKey="value">
                  {[completadosReal, pendientesReal].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} pagos`, 'Cantidad']} />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
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
              <LineChart data={mesesArray.map(periodo => ({ periodo: selectedYearStats === "Todos" ? periodo : periodo.split(' ')[0].substring(0, 3), monto: pagosPorMes[periodo]?.total || 0 }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="periodo" tick={{ fill: '#0c476b', fontSize: 12 }} label={{ value: selectedYearStats === "Todos" ? 'Año' : 'Mes', position: 'insideBottom', offset: -5, fill: '#0c476b' }} />
                <YAxis tick={{ fill: '#0c476b', fontSize: 12 }} label={{ value: 'Monto ($)', angle: -90, position: 'insideLeft', fill: '#0c476b' }} />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Recaudación']} contentStyle={{ backgroundColor: '#fff', border: '2px solid #0c476b', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Line type="monotone" dataKey="monto" stroke="#0c476b" strokeWidth={3} name="Recaudación Total" dot={{ fill: '#0c476b', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'bar':
        return (
          <div key={widget.id} draggable onDragStart={() => handleDragStart(widgets.indexOf(widget))} onDragOver={(e) => handleDragOver(e, widgets.indexOf(widget))} onDragEnd={handleDragEnd} className="bg-white rounded-xl shadow-lg p-6 border-2 border-aneupi-primary/20 cursor-move lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <FaGripVertical className="text-aneupi-primary/40" />
              <h3 className="text-xl font-bold text-aneupi-primary">{selectedYearStats === "Todos" ? "Recaudación Anual por Estado" : "Recaudación Mensual por Estado"}</h3>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={mesesArray.map(periodo => ({ periodo: selectedYearStats === "Todos" ? periodo : periodo.split(' ')[0].substring(0, 3), Completados: pagosPorMes[periodo]?.completados || 0, Pendientes: pagosPorMes[periodo]?.pendientes || 0 }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="periodo" tick={{ fill: '#0c476b', fontSize: 12 }} label={{ value: selectedYearStats === "Todos" ? 'Año' : 'Mes', position: 'insideBottom', offset: -5, fill: '#0c476b' }} />
                <YAxis tick={{ fill: '#0c476b', fontSize: 12 }} label={{ value: 'Cantidad de Pagos', angle: -90, position: 'insideLeft', fill: '#0c476b' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #0c476b', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="Completados" fill="#0c476b" name="Pagos Completados" />
                <Bar dataKey="Pendientes" fill="#f59e0b" name="Pagos Pendientes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'table':
        return (
          <div key={widget.id} draggable onDragStart={() => handleDragStart(widgets.indexOf(widget))} onDragOver={(e) => handleDragOver(e, widgets.indexOf(widget))} onDragEnd={handleDragEnd} className="bg-white rounded-xl shadow-lg p-6 border-2 border-aneupi-primary/20 cursor-move lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <FaGripVertical className="text-aneupi-primary/40" />
              <h3 className="text-xl font-bold text-aneupi-primary">Evolución {selectedYearStats === "Todos" ? "Anual" : "Mensual"} de Pagos</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-2 border-aneupi-primary">
                <thead className="bg-aneupi-bg-tertiary">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold text-aneupi-primary border-b-2 border-aneupi-primary">{selectedYearStats === "Todos" ? "Año" : "Mes"}</th>
                    <th className="py-3 px-4 text-center font-semibold text-aneupi-primary border-b-2 border-aneupi-primary">Total</th>
                    <th className="py-3 px-4 text-center font-semibold text-aneupi-primary border-b-2 border-aneupi-primary">Completados</th>
                    <th className="py-3 px-4 text-center font-semibold text-aneupi-primary border-b-2 border-aneupi-primary">Pendientes</th>
                    <th className="py-3 px-4 text-center font-semibold text-aneupi-primary border-b-2 border-aneupi-primary">Promedio</th>
                    <th className="py-3 px-4 text-center font-semibold text-aneupi-primary border-b-2 border-aneupi-primary">Eficiencia</th>
                  </tr>
                </thead>
                <tbody>
                  {mesesArray.map((mes, index) => {
                    const datosMes = pagosPorMes[mes];
                    const totalMes = datosMes.completados + datosMes.pendientes;
                    const eficiencia = totalMes > 0 ? Math.round((datosMes.completados / totalMes) * 100) : 0;
                    return (
                      <tr key={mes} className={index % 2 === 0 ? 'bg-white' : 'bg-aneupi-bg-tertiary'}>
                        <td className="py-3 px-4 font-medium text-aneupi-primary border-b-2 border-aneupi-primary">{mes}</td>
                        <td className="py-3 px-4 text-center border-b-2 border-aneupi-primary"><span className="font-bold text-aneupi-primary">${datosMes.total.toLocaleString()}</span></td>
                        <td className="py-3 px-4 text-center border-b-2 border-aneupi-primary"><span className="px-3 py-1 bg-aneupi-bg-tertiary text-aneupi-primary rounded-full text-sm border-2 border-aneupi-primary/20">{datosMes.completados}</span></td>
                        <td className="py-3 px-4 text-center border-b-2 border-aneupi-primary"><span className="px-3 py-1 bg-aneupi-bg-tertiary text-aneupi-primary rounded-full text-sm border-2 border-aneupi-primary/20">{datosMes.pendientes}</span></td>
                        <td className="py-3 px-4 text-center border-b-2 border-aneupi-primary"><span className="font-medium text-aneupi-primary">${(datosMes.promedio || 0).toLocaleString()}</span></td>
                        <td className="py-3 px-4 text-center border-b-2 border-aneupi-primary"><span className="px-3 py-1 rounded-full text-sm font-medium bg-aneupi-bg-tertiary text-aneupi-primary border-2 border-aneupi-primary/20">{eficiencia}%</span></td>
                      </tr>
                    );
                  })}
                  <tr className="bg-aneupi-primary text-white">
                    <td className="py-3 px-4 font-bold border-b-2 border-aneupi-primary">TOTAL {selectedYearStats === "Todos" ? "GENERAL" : selectedYearStats}</td>
                    <td className="py-3 px-4 text-center font-bold border-b-2 border-aneupi-primary">${totalRecaudadoReal.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center font-bold border-b-2 border-aneupi-primary">{completadosReal}</td>
                    <td className="py-3 px-4 text-center font-bold border-b-2 border-aneupi-primary">{pendientesReal}</td>
                    <td className="py-3 px-4 text-center font-bold border-b-2 border-aneupi-primary">${promedioReal.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center font-bold border-b-2 border-aneupi-primary">{tasaCumplimientoReal}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="p-7">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-aneupi-primary mb-4">Estadísticas Avanzadas - Sistema ANEUPI</h2>
            <p className="text-aneupi-text-secondary">Análisis detallado de multas y pagos ({totalAccionistas} accionistas)</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={() => setShowConfig(!showConfig)} className="px-4 py-2 bg-aneupi-primary text-white rounded-lg hover:bg-aneupi-primary-dark transition-colors flex items-center gap-2">
              <FaCog /> Configurar
            </button>
            <span className="text-aneupi-primary font-medium">Año:</span>
            <select value={selectedYearStats} onChange={(e) => setSelectedYearStats(e.target.value)} className="px-4 py-2 border-2 border-aneupi-primary/20 rounded-lg bg-white text-aneupi-primary focus:outline-none focus:ring-2 focus:ring-aneupi-primary focus:border-aneupi-primary">
              <option value="Todos">Todos los años</option>
              {anios && anios.map(anio => (
                <option key={anio} value={anio}>{anio}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {showConfig && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-aneupi-primary/20">
          <h3 className="text-lg font-bold text-aneupi-primary mb-4">Configuración de Widgets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {widgets.map(widget => (
              <div key={widget.id} className="flex items-center justify-between p-3 bg-aneupi-bg-tertiary rounded-lg border border-aneupi-primary/20">
                <span className="text-aneupi-primary font-medium">{widget.name}</span>
                <button onClick={() => toggleVisibility(widget.id)} className={`px-3 py-1 rounded-lg flex items-center gap-2 transition-colors ${widget.visible ? 'bg-aneupi-primary text-white' : 'bg-gray-300 text-gray-600'}`}>
                  {widget.visible ? <><FaEye /> Visible</> : <><FaEyeSlash /> Oculto</>}
                </button>
              </div>
            ))}
          </div>
          <p className="text-sm text-aneupi-text-muted mt-4">Arrastra los widgets para reordenarlos</p>
        </div>
      )}

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
