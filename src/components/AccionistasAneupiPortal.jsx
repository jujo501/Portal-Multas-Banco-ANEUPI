import { useState, useEffect, useMemo, useCallback } from "react";
import Header from "./Header";
import Tabs from "./Tabs";
import AccionistasTab from "./AccionistasTab";
import PagosTab from "./PagosTab";
import EstadisticasTab from "./EstadisticasTab";
import ReportesTab from "./ReportesTab";
import FiltrosAvanzados from "./FiltrosAvanzados";
import LoadingSpinner from "./LoadingSpinner";
import { 
  generarAccionistas, 
  generarMultasPorAnio, 
  generarPagosDiarios, 
  generarResumenMensual, 
  generarNotificaciones,
  meses,
  anios,
  anioInicio,
  anioFin
} from "../utils/dataGenerators";
import { FaUser, FaDollarSign, FaClock, FaCalendarAlt, FaUniversity, FaBell, FaEnvelope, FaShieldAlt, FaChartBar, FaMoneyCheckAlt, FaDatabase, FaInfoCircle, FaInfo } from "react-icons/fa";

export default function AccionistasAneupiPortal() {
  // Estados principales
  const [activeTab, setActiveTab] = useState("Accionistas");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("Todos");
  const [selectedYearPagos, setSelectedYearPagos] = useState("Todos");
  const [selectedMonth, setSelectedMonth] = useState("Todos");
  const [selectedDay, setSelectedDay] = useState("Todos");
  const [viewTypePagos, setViewTypePagos] = useState("mensual");
  const [isLoading, setIsLoading] = useState(false);
  const [accionistaSeleccionado, setAccionistaSeleccionado] = useState(null);
  
  // Estados para funcionalidades avanzadas
  const [exportandoExcel, setExportandoExcel] = useState(false);
  const [filtroAvanzado, setFiltroAvanzado] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
  const [filtrosActivos, setFiltrosActivos] = useState([]);
  const [mostrarRecordatorios, setMostrarRecordatorios] = useState(true);

  // Estados de paginación
  const [paginaActualAccionistas, setPaginaActualAccionistas] = useState(1);
  const [itemsPorPaginaAccionistas, setItemsPorPaginaAccionistas] = useState(10);
  const [totalPaginasAccionistas, setTotalPaginasAccionistas] = useState(1);
  const [paginaActualPagos, setPaginaActualPagos] = useState(1);
  const [itemsPorPaginaPagos, setItemsPorPaginaPagos] = useState(15);
  const [totalPaginasPagos, setTotalPaginasPagos] = useState(1);

  // Estados de ordenamiento
  const [sortConfigAccionistas, setSortConfigAccionistas] = useState({ key: 'id', direction: 'asc' });
  const [sortConfigPagos, setSortConfigPagos] = useState({ key: 'id', direction: 'asc' });

  // Estados para estadísticas
  const [estadisticasAvanzadas, setEstadisticasAvanzadas] = useState({
    totalMultasAcumulado: 0,
    promedioMultas: 0,
    maximaMulta: 0,
    minimaMulta: 0,
    accionistaMayorMulta: "",
    accionistaMenorMulta: "",
    crecimientoAnual: 0
  });

  const [selectedYearStats, setSelectedYearStats] = useState("Todos");
  const [estadisticasAccionista, setEstadisticasAccionista] = useState({
    asambleasConFechas: 0,
    atrasos: 0,
    otrasMultas: 0,
    totalAPagar: 0,
    totalCompletados: 0,
    totalPendientes: 0
  });

  // Datos
  const [mapaAccionistas, setMapaAccionistas] = useState({});
  const [accionistasData, setAccionistasData] = useState([]);
  const [filteredAccionistas, setFilteredAccionistas] = useState([]);
  const [multasPorAnio, setMultasPorAnio] = useState({});
  const [pagosDiariosData, setPagosDiariosData] = useState([]);
  const [resumenMensual, setResumenMensual] = useState({});

  // Obtener días del mes seleccionado
  const obtenerDiasDelMes = useCallback(() => {
    const diasPorMes = {
      "Enero": 31, "Febrero": 28, "Marzo": 31, "Abril": 30, "Mayo": 31, "Junio": 30,
      "Julio": 31, "Agosto": 31, "Septiembre": 30, "Octubre": 31, "Noviembre": 30, "Diciembre": 31
    };
    
    if (selectedMonth === "Todos") return ["Todos"];
    
    const dias = [];
    for (let i = 1; i <= diasPorMes[selectedMonth]; i++) {
      dias.push(i);
    }
    return ["Todos", ...dias];
  }, [selectedMonth]);

  const dias = obtenerDiasDelMes();

  // Inicializar datos
  useEffect(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      const accionistasGenerados = generarAccionistas();
      setAccionistasData(accionistasGenerados);
      setFilteredAccionistas(accionistasGenerados);
      
      const mapa = {};
      accionistasGenerados.forEach(accionista => {
        mapa[accionista.id] = accionista;
      });
      setMapaAccionistas(mapa);
      
      const multasGeneradas = generarMultasPorAnio(accionistasGenerados);
      setMultasPorAnio(multasGeneradas);
      
      const pagosGenerados = generarPagosDiarios(accionistasGenerados);
      setPagosDiariosData(pagosGenerados);
      
      const resumenGenerado = generarResumenMensual(pagosGenerados);
      setResumenMensual(resumenGenerado);
      
      const notificacionesIniciales = generarNotificaciones();
      setNotificaciones(notificacionesIniciales);
      
      calcularEstadisticasAvanzadas(multasGeneradas, accionistasGenerados);
      
      setIsLoading(false);
    }, 1000);
  }, []);

  // Calcular estadísticas avanzadas
  const calcularEstadisticasAvanzadas = (multas, accionistas) => {
    if (!multas["2024"] || multas["2024"].length === 0) return;
    
    const total2024 = multas["2024"].reduce((a, b) => a + b, 0);
    const total2023 = multas["2023"].reduce((a, b) => a + b, 0);
    
    // Calcular total acumulado de todos los años disponibles
    const aniosDisponibles = ["2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"];
    const totalAcumulado = aniosDisponibles.reduce((sum, anio) => {
      return sum + (multas[anio]?.reduce((a, b) => a + b, 0) || 0);
    }, 0);
    
    const crecimiento = total2023 > 0 ? ((total2024 - total2023) / total2023) * 100 : 0;
    
    const maxMulta = Math.max(...multas["2024"]);
    const minMulta = Math.min(...multas["2024"]);
    const maxIndex = multas["2024"].indexOf(maxMulta);
    const minIndex = multas["2024"].indexOf(minMulta);
    
    setEstadisticasAvanzadas({
      totalMultasAcumulado: totalAcumulado,
      promedioMultas: Math.round(total2024 / multas["2024"].length),
      maximaMulta: maxMulta,
      minimaMulta: minMulta,
      accionistaMayorMulta: accionistas[maxIndex]?.nombre || "",
      accionistaMenorMulta: accionistas[minIndex]?.nombre || "",
      crecimientoAnual: Math.round(crecimiento * 10) / 10
    });
  };

  // Filtrar y ordenar accionistas
  useEffect(() => {
    let filtered = [...accionistasData];
    
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(accionista =>
        accionista.nombre.toLowerCase().includes(term) ||
        accionista.codigo.toLowerCase().includes(term) ||
        accionista.email.toLowerCase().includes(term) ||
        accionista.telefono.includes(term) ||
        accionista.direccion?.toLowerCase().includes(term) ||
        accionista.tipoAccionista?.toLowerCase().includes(term)
      );
    }
    
    if (filtrosActivos.length > 0) {
      filtered = filtered.filter(accionista => {
        return filtrosActivos.every(filtro => {
          if (filtro.tipo === "estado") return accionista.estado === filtro.valor;
          if (filtro.tipo === "tipoAccionista") return accionista.tipoAccionista === filtro.valor;
          return true;
        });
      });
    }
    
    filtered.sort((a, b) => {
      if (sortConfigAccionistas.key === 'id') {
        return sortConfigAccionistas.direction === 'asc' ? a.id - b.id : b.id - a.id;
      }
      if (sortConfigAccionistas.key === 'nombre') {
        return sortConfigAccionistas.direction === 'asc' 
          ? a.nombre.localeCompare(b.nombre)
          : b.nombre.localeCompare(a.nombre);
      }
      if (sortConfigAccionistas.key === 'fechaIngreso') {
        return sortConfigAccionistas.direction === 'asc' 
          ? new Date(a.fechaIngreso) - new Date(b.fechaIngreso)
          : new Date(b.fechaIngreso) - new Date(a.fechaIngreso);
      }
      return 0;
    });
    
    setFilteredAccionistas(filtered);
    setTotalPaginasAccionistas(Math.ceil(filtered.length / itemsPorPaginaAccionistas));
    setPaginaActualAccionistas(1);
  }, [searchTerm, accionistasData, itemsPorPaginaAccionistas, sortConfigAccionistas, filtrosActivos]);

  // Manejar ordenamiento
  const handleSortAccionistas = (key) => {
    setSortConfigAccionistas(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Filtrar pagos
  const pagosFiltrados = useMemo(() => {
    let filtered = [...pagosDiariosData];
    
    if (accionistaSeleccionado) {
      filtered = filtered.filter(pago => pago.accionistaId === accionistaSeleccionado.id);
      // Aplicar filtro de año también cuando hay accionista seleccionado
      if (selectedYearPagos && selectedYearPagos !== "Todos") {
        filtered = filtered.filter(pago => pago.fechaPago && pago.fechaPago.includes(selectedYearPagos));
      }
    } else {
      // Filtrar por año
      if (selectedYearPagos && selectedYearPagos !== "Todos") {
        filtered = filtered.filter(pago => pago.fechaPago && pago.fechaPago.includes(selectedYearPagos));
      }
      // Filtrar por mes
      if (selectedMonth !== "Todos") filtered = filtered.filter(pago => pago.mes && pago.mes.includes(selectedMonth));
      // Filtrar por día
      if (selectedDay !== "Todos") filtered = filtered.filter(pago => pago.dia === selectedDay);
    }
    
    filtered.sort((a, b) => {
      if (sortConfigPagos.key === 'id') return sortConfigPagos.direction === 'asc' ? a.id - b.id : b.id - a.id;
      if (sortConfigPagos.key === 'fechaIngresoMulta') {
        return sortConfigPagos.direction === 'desc'
          ? new Date(b.fechaIngresoMulta) - new Date(a.fechaIngresoMulta)
          : new Date(a.fechaIngresoMulta) - new Date(b.fechaIngresoMulta);
      }
      if (sortConfigPagos.key === 'fechaPago') {
        const fechaA = a.fechaPago ? new Date(a.fechaPago) : new Date(0);
        const fechaB = b.fechaPago ? new Date(b.fechaPago) : new Date(0);
        return sortConfigPagos.direction === 'desc' ? fechaB - fechaA : fechaA - fechaB;
      }
      if (sortConfigPagos.key === 'monto') {
        return sortConfigPagos.direction === 'desc' ? b.monto - a.monto : a.monto - b.monto;
      }
      if (sortConfigPagos.key === 'estado') {
        return sortConfigPagos.direction === 'desc'
          ? b.estado.localeCompare(a.estado)
          : a.estado.localeCompare(b.estado);
      }
      return 0;
    });
    
    return filtered;
  }, [pagosDiariosData, accionistaSeleccionado, selectedYearPagos, selectedMonth, selectedDay, sortConfigPagos]);

  // Actualizar estadísticas del accionista
  useEffect(() => {
    if (accionistaSeleccionado) {
      const pagosAccionista = pagosFiltrados.filter(pago => pago.accionistaId === accionistaSeleccionado.id);
      const asambleasConFechas = pagosAccionista.filter(pago => pago.descripcion.toLowerCase().includes("asamblea")).length;
      const atrasos = pagosAccionista.filter(pago => 
        pago.descripcion.toLowerCase().includes("retraso") || 
        pago.descripcion.toLowerCase().includes("mora") ||
        pago.descripcion.toLowerCase().includes("atraso")
      ).length;
      const otrasMultas = pagosAccionista.length - asambleasConFechas - atrasos;
      const totalAPagar = pagosAccionista.reduce((total, pago) => total + pago.monto, 0);
      



      setEstadisticasAccionista({ asambleasConFechas, atrasos, otrasMultas, totalAPagar });
    }
  }, [accionistaSeleccionado, pagosFiltrados]);

  // Actualizar paginación de pagos
  useEffect(() => {
    setTotalPaginasPagos(Math.ceil(pagosFiltrados.length / itemsPorPaginaPagos));
    if (paginaActualPagos > Math.ceil(pagosFiltrados.length / itemsPorPaginaPagos)) {
      setPaginaActualPagos(1);
    }
  }, [pagosFiltrados.length, itemsPorPaginaPagos, paginaActualPagos]);

  // Funciones de ordenamiento para pagos
  const handleSortPagos = (key) => {
    setSortConfigPagos(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Manejar selección de accionista
  const handleSeleccionarAccionistaDesdePagos = useCallback((accionistaId) => {
    const accionista = accionistasData.find(a => a.id === accionistaId) || mapaAccionistas[accionistaId];
    if (accionista) setAccionistaSeleccionado(accionista);
  }, [accionistasData, mapaAccionistas]);

  // Exportar a Excel
  const exportarAExcel = (tipo) => {
    setExportandoExcel(true);
    setTimeout(() => {
      alert(`Exportación completada para ${tipo}`);
      setExportandoExcel(false);
    }, 2000);
  };

  // Enviar recordatorios
  const enviarRecordatorios = () => {
    const pagosPendientes = pagosDiariosData.filter(pago => pago.estado === "Pendiente");
    if (pagosPendientes.length === 0) {
      alert("No hay pagos pendientes");
      return;
    }
    alert(`${pagosPendientes.length} recordatorios enviados`);
  };

  // Marcar notificación como leída
  const marcarNotificacionLeida = (id) => {
    setNotificaciones(prev => prev.map(notif => notif.id === id ? { ...notif, leida: true } : notif));
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltrosActivos([]);
  };

  // Agregar filtro
  const agregarFiltro = (tipo, valor) => {
    if (!filtrosActivos.some(f => f.tipo === tipo && f.valor === valor)) {
      setFiltrosActivos(prev => [...prev, { tipo, valor }]);
    }
  };

  // Remover filtro
  const removerFiltro = (index) => {
    setFiltrosActivos(prev => prev.filter((_, i) => i !== index));
  };

  // Obtener accionistas para la página actual
  const obtenerAccionistasPaginaActual = () => {
    const inicio = (paginaActualAccionistas - 1) * itemsPorPaginaAccionistas;
    const fin = inicio + itemsPorPaginaAccionistas;
    return filteredAccionistas.slice(inicio, fin);
  };

  // Obtener pagos para la página actual
  const obtenerPagosPaginaActual = () => {
    const inicio = (paginaActualPagos - 1) * itemsPorPaginaPagos;
    const fin = inicio + itemsPorPaginaPagos;
    return pagosFiltrados.slice(inicio, fin);
  };

  // Calcular totales
  const calcularTotalMultasTodosAnios = () => {
    return pagosDiariosData.reduce((sum, pago) => sum + pago.monto, 0);
  };

  const calcularTotalMultas = () => multasPorAnio[selectedYear]?.reduce((sum, multa) => sum + multa, 0) || 0;
  const calcularTotalMontosPaginaActual = () => obtenerPagosPaginaActual().reduce((total, pago) => total + pago.monto, 0);
  const calcularTotalPagosFiltrados = () => pagosFiltrados.reduce((total, pago) => total + pago.monto, 0);
  const calcularPagosPendientes = () => pagosDiariosData.filter(pago => pago.estado === "Pendiente").length;

  // Obtener accionista por ID
  const obtenerAccionistaPorId = (id) => {
    return accionistasData.find(a => a.id === id) || mapaAccionistas[id];
  };

  return (
    <div className="min-h-screen bg-aneupi-bg-tertiary p-4 md:p-8">
      {isLoading && <LoadingSpinner totalAccionistas={20} />}

      <Header 
        notificaciones={notificaciones} 
        setNotificaciones={setNotificaciones}
        filtroAvanzado={filtroAvanzado}
        setFiltroAvanzado={setFiltroAvanzado}
        enviarRecordatorios={enviarRecordatorios}
        marcarNotificacionLeida={marcarNotificacionLeida}
        totalAccionistas={accionistasData.length}
      />

      <FiltrosAvanzados 
        filtroAvanzado={filtroAvanzado}
        setFiltroAvanzado={setFiltroAvanzado}
        filtrosActivos={filtrosActivos}
        removerFiltro={removerFiltro}
        limpiarFiltros={limpiarFiltros}
        agregarFiltro={agregarFiltro}
      />

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <button onClick={() => setActiveTab("Accionistas")} className="bg-white rounded-xl shadow-lg p-6 border border-aneupi-border-light hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer text-left hover:border-aneupi-primary group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-aneupi-text-secondary font-medium group-hover:text-aneupi-primary">Total Accionistas</h3>
            <div className="p-2 bg-aneupi-secondary/20 rounded-lg group-hover:bg-aneupi-primary group-hover:text-white transition-colors border border-aneupi-secondary/30">
              <FaUser className="text-aneupi-primary group-hover:text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-aneupi-primary">{accionistasData.length}</p>
          <p className="text-sm text-aneupi-text-muted mt-2">Accionistas principales</p>
          <div className="mt-4 flex items-center text-aneupi-primary text-sm font-medium group-hover:text-aneupi-primary-dark">
            <span>Ver Accionistas</span>
          </div>
        </button>

        <button onClick={() => setActiveTab("Pago de multas")} className="bg-white rounded-xl shadow-lg p-6 border border-aneupi-border-light hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer text-left hover:border-aneupi-primary group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-aneupi-text-secondary font-medium group-hover:text-aneupi-primary">Multas Totales</h3>
            <div className="p-2 bg-aneupi-secondary/20 rounded-lg group-hover:bg-aneupi-primary group-hover:text-white transition-colors border border-aneupi-secondary/30">
              <FaDollarSign className="text-aneupi-primary group-hover:text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-aneupi-primary">${calcularTotalMultasTodosAnios().toLocaleString()}</p>
          <p className="text-sm text-aneupi-text-muted mt-2">Acumulado {anioInicio}-{anioFin}</p>
          <div className="mt-4 flex items-center text-aneupi-primary text-sm font-medium group-hover:text-aneupi-primary-dark">
            <span>Ver pago de multas</span>
          </div>
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-aneupi-border-light hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 group cursor-pointer" onClick={() => { setActiveTab("Pago de multas"); setMostrarRecordatorios(true); }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-aneupi-text-secondary font-medium group-hover:text-aneupi-primary">Pagos Pendientes</h3>
            <div className="p-2 bg-aneupi-secondary/20 rounded-lg group-hover:bg-aneupi-primary group-hover:text-white transition-colors border border-aneupi-secondary/30">
              <FaClock className="text-aneupi-primary group-hover:text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-aneupi-primary">{calcularPagosPendientes()}</p>
          <p className="text-sm text-aneupi-text-muted mt-2">Requieren atención</p>
          <div className="mt-4 flex items-center text-aneupi-primary text-sm font-medium group-hover:text-aneupi-primary-dark">
            <span>Gestionar pagos</span>
          </div>
        </div>
      </div>

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-aneupi-border-light">
        {activeTab === "Accionistas" && (
          <AccionistasTab 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            exportandoExcel={exportandoExcel}
            exportarAExcel={exportarAExcel}
            filteredAccionistas={filteredAccionistas}
            multasPorAnio={multasPorAnio}
            pagosDiariosData={pagosDiariosData}
            anios={anios}
            anioInicio={anioInicio}
            anioFin={anioFin}
            sortConfigAccionistas={sortConfigAccionistas}
            handleSortAccionistas={handleSortAccionistas}
            obtenerAccionistasPaginaActual={obtenerAccionistasPaginaActual}
            calcularTotalMultas={calcularTotalMultas}
            calcularTotalMultasAccionista={(index) => {
              const multa2023 = multasPorAnio["2023"]?.[index] || 0;
              const multa2024 = multasPorAnio["2024"]?.[index] || 0;
              const multa2025 = multasPorAnio["2025"]?.[index] || 0;
              return multa2023 + multa2024 + multa2025;
            }}
            paginaActualAccionistas={paginaActualAccionistas}
            setPaginaActualAccionistas={setPaginaActualAccionistas}
            totalPaginasAccionistas={totalPaginasAccionistas}
            itemsPorPaginaAccionistas={itemsPorPaginaAccionistas}
            setItemsPorPaginaAccionistas={setItemsPorPaginaAccionistas}
            totalItems={filteredAccionistas.length}
            obtenerAccionistaPorId={obtenerAccionistaPorId}
            totalAccionistas={accionistasData.length}
          />
        )}

        {activeTab === "Pago de multas" && (
          <PagosTab 
            accionistaSeleccionado={accionistaSeleccionado}
            setAccionistaSeleccionado={setAccionistaSeleccionado}
            viewTypePagos={viewTypePagos}
            setViewTypePagos={setViewTypePagos}
            selectedYearPagos={selectedYearPagos}
            setSelectedYearPagos={setSelectedYearPagos}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            meses={meses}
            dias={dias}
            anios={anios}
            estadisticasAccionista={estadisticasAccionista}
            pagosFiltrados={pagosFiltrados}
            mapaAccionistas={mapaAccionistas}
            handleSeleccionarAccionistaDesdePagos={handleSeleccionarAccionistaDesdePagos}
            sortConfigPagos={sortConfigPagos}
            handleSortPagos={handleSortPagos}
            obtenerPagosPaginaActual={obtenerPagosPaginaActual}
            calcularTotalMontosPaginaActual={calcularTotalMontosPaginaActual}
            calcularTotalPagosFiltrados={calcularTotalPagosFiltrados}
            paginaActualPagos={paginaActualPagos}
            setPaginaActualPagos={setPaginaActualPagos}
            totalPaginasPagos={totalPaginasPagos}
            itemsPorPaginaPagos={itemsPorPaginaPagos}
            setItemsPorPaginaPagos={setItemsPorPaginaPagos}
            totalItems={pagosFiltrados.length}
            totalAccionistas={accionistasData.length}
          />
        )}

        {activeTab === "Estadísticas" && (
          <EstadisticasTab 
            selectedYearStats={selectedYearStats}
            setSelectedYearStats={setSelectedYearStats}
            resumenMensual={resumenMensual}
            estadisticasAvanzadas={estadisticasAvanzadas}
            totalAccionistas={accionistasData.length}
          />
        )}

        {activeTab === "Reportes" && <ReportesTab totalAccionistas={accionistasData.length} />}
      </div>

      {/* Información adicional */}
      <div className="bg-white rounded-xl shadow-lg p-7 mb-10 border-2 border-aneupi-primary">
        <h3 className="text-xl font-bold text-aneupi-primary mb-6 flex items-center gap-2">
          <FaInfoCircle className="text-aneupi-primary" />
          Información del Sistema ANEUPI
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border-l-4 border-aneupi-primary pl-5">
            <h4 className="font-semibold text-aneupi-primary mb-3">Características Técnicas</h4>
            <ul className="space-y-3 text-aneupi-text-secondary">
              <li className="flex items-center gap-2">
                <FaDatabase className="text-aneupi-primary text-sm" />
                <span>Base de datos: {accionistasData.length} accionistas principales</span>
              </li>
              <li className="flex items-center gap-2">
                <FaChartBar className="text-aneupi-primary text-sm" />
                <span>Paginación avanzada: Navegación por lotes de datos</span>
              </li>
              <li className="flex items-center gap-2">
                <FaInfo className="text-aneupi-primary text-sm" />
                <span>Búsqueda inteligente: Nombre, código, email, departamento</span>
              </li>
              <li className="flex items-center gap-2">
                <FaMoneyCheckAlt className="text-aneupi-primary text-sm" />
                <span>Ordenamiento múltiple: Por nombre, fecha, monto</span>
              </li>
            </ul>
          </div>
          <div className="border-l-4 border-aneupi-primary pl-5">
            <h4 className="font-semibold text-aneupi-primary mb-3">Soporte y Contacto</h4>
            <ul className="space-y-3 text-aneupi-text-secondary">
              <li className="flex items-center gap-2">
                <FaUniversity className="text-aneupi-primary text-sm" />
                <span>Banco ANEUPI: Sistema exclusivo para accionistas</span>
              </li>
              <li className="flex items-center gap-2">
                <FaBell className="text-aneupi-primary text-sm" />
                <span>Soporte 24/7: (01) 800-ANEUPI (263874)</span>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-aneupi-primary text-sm" />
                <span>Email: soporte.multas@aneupi.com</span>
              </li>
              <li className="flex items-center gap-2">
                <FaCalendarAlt className="text-aneupi-primary text-sm" />
                <span>Horario atención: L-V 7:00 AM - 10:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-aneupi-text-muted text-sm border-t-2 border-aneupi-primary pt-8 pb-4">
        <p>© 2024 Sistema de Gestión de Multas - Banco ANEUPI. Todos los derechos reservados.</p>
        <p className="mt-3">Versión 4.0.0 • Sistema especializado para la gestión y seguimiento de multas aplicadas a los accionistas • Última actualización: Diciembre 2024</p>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <span className="flex items-center gap-1">
            <FaDatabase className="text-aneupi-primary" /> {accionistasData.length} Accionistas
          </span>
          <span className="flex items-center gap-1">
            <FaMoneyCheckAlt className="text-aneupi-primary" /> {pagosDiariosData.length} Transacciones
          </span>
          <span className="flex items-center gap-1">
            <FaChartBar className="text-aneupi-primary" /> Estadísticas en tiempo real
          </span>
          <span className="flex items-center gap-1">
            <FaShieldAlt className="text-aneupi-primary" /> Pagos seguros ANEUPI
          </span>
        </div>
      </div>
    </div>
  );
}