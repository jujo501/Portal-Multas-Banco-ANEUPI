import { useState, useEffect, useMemo, useCallback } from "react";
import Header from "./Header";
import Tabs from "./Tabs";
import AccionistasTab from "./AccionistasTab";
import PagosTab from "./PagosTab";
import EstadisticasTab from "./EstadisticasTab";
import ReportesTab from "./ReportesTab";
import FiltrosAvanzados from "./FiltrosAvanzados";
import LoadingSpinner from "./LoadingSpinner";
import { accionistasService, pagosService } from "../services";
import { generarMultasPorAnio, generarResumenMensual, generarNotificaciones, meses, anios } from "../utils/dataGenerators";
import { FaUser, FaDollarSign, FaClock, FaSignOutAlt } from "react-icons/fa";

export default function AccionistasAneupiPortal({ usuarioLogueado, onLogout }) {
  
  const usuarioActual = usuarioLogueado || { id: 0, nombre: "Invitado", rol: "USER" };
  const esAdmin = usuarioActual.rol === "ADMIN" || usuarioActual.rol === "SUPERADMIN";

  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('activeTab');
    if (!esAdmin && savedTab === 'Accionistas') return 'Pago de multas';
    return savedTab || (esAdmin ? 'Accionistas' : 'Pago de multas');
  });

  const [isLoading, setIsLoading] = useState(false);
  const [accionistasData, setAccionistasData] = useState([]);
  const [pagosData, setPagosData] = useState([]); 
  
  // Filtros UI Accionistas
  const [searchTerm, setSearchTerm] = useState("");

  // NUEVO: Filtros UI Pagos
  const [searchTermPagos, setSearchTermPagos] = useState("");

  const [accionistaSeleccionado, setAccionistaSeleccionado] = useState(null);
  const [selectedYear, setSelectedYear] = useState("Todos");
  const [selectedYearPagos, setSelectedYearPagos] = useState("Todos");
  const [selectedMonth, setSelectedMonth] = useState("Todos");
  const [selectedDay, setSelectedDay] = useState("Todos");
  const [viewTypePagos, setViewTypePagos] = useState("mensual");
  
  const [filtroAvanzado, setFiltroAvanzado] = useState(false);
  const [filtrosActivos, setFiltrosActivos] = useState([]); // Estado para filtros múltiples
  const [notificaciones, setNotificaciones] = useState([]);
  const [exportandoExcel, setExportandoExcel] = useState(false);
  const [mostrarRecordatorios, setMostrarRecordatorios] = useState(true);

  // Paginación
  const [paginaActualAccionistas, setPaginaActualAccionistas] = useState(1);
  const [itemsPorPaginaAccionistas, setItemsPorPaginaAccionistas] = useState(10);
  const [paginaActualPagos, setPaginaActualPagos] = useState(1);
  const [itemsPorPaginaPagos, setItemsPorPaginaPagos] = useState(15);

  const [sortConfigAccionistas, setSortConfigAccionistas] = useState({ key: 'id', direction: 'asc' });
  const [sortConfigPagos, setSortConfigPagos] = useState({ key: 'id', direction: 'asc' });

  // Stats
  const [estadisticasAvanzadas, setEstadisticasAvanzadas] = useState({});
  const [estadisticasAccionista, setEstadisticasAccionista] = useState({});
  const [selectedYearStats, setSelectedYearStats] = useState("Todos");
  const [resumenMensual, setResumenMensual] = useState({});
  const [multasPorAnio, setMultasPorAnio] = useState({});
  const [mapaAccionistas, setMapaAccionistas] = useState({});

  
  const obtenerDiasDelMes = useCallback(() => {
    const diasPorMes = { "Enero": 31, "Febrero": 28, "Marzo": 31, "Abril": 30, "Mayo": 31, "Junio": 30, "Julio": 31, "Agosto": 31, "Septiembre": 30, "Octubre": 31, "Noviembre": 30, "Diciembre": 31 };
    if (selectedMonth === "Todos") return ["Todos"];
    const diasArray = [];
    for (let i = 1; i <= diasPorMes[selectedMonth]; i++) { diasArray.push(i); }
    return ["Todos", ...diasArray];
  }, [selectedMonth]);

  const dias = obtenerDiasDelMes(); 

  useEffect(() => { localStorage.setItem('activeTab', activeTab); }, [activeTab]);

  // --- CARGA DE DATOS ---
  useEffect(() => {
    const cargarDatos = async () => {
      setIsLoading(true);
      try {
        const [resAccionistas, resPagos] = await Promise.all([
          accionistasService.getAll(),
          pagosService.getAll()
        ]);

        let listaAccionistas = Array.isArray(resAccionistas) ? resAccionistas : (resAccionistas?.data || []);
        let listaPagos = Array.isArray(resPagos) ? resPagos : (resPagos?.data || []);

        
        listaAccionistas = listaAccionistas.filter(acc => 
            acc.nombre !== "Administrador Principal" && 
            acc.rol !== "ADMIN" && 
            acc.rol !== "SUPERADMIN"
        );

        if (!esAdmin) {
            listaAccionistas = listaAccionistas.filter(a => a.id === usuarioActual.id);
            listaPagos = listaPagos.filter(p => p.accionistaId === usuarioActual.id);
            if (listaAccionistas.length > 0) setAccionistaSeleccionado(listaAccionistas[0]);
        }

        setAccionistasData(listaAccionistas);
        setPagosData(listaPagos);

        const mapa = {};
        listaAccionistas.forEach(acc => mapa[acc.id] = acc);
        setMapaAccionistas(mapa);

        setMultasPorAnio(generarMultasPorAnio(listaAccionistas));
        setResumenMensual(generarResumenMensual(listaPagos));
        setNotificaciones(generarNotificaciones());

        if (listaPagos.length > 0) {
           const total = listaPagos.reduce((sum, p) => sum + Number(p.monto), 0);
           setEstadisticasAvanzadas(prev => ({ ...prev, totalMultasAcumulado: total }));
        }

      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    cargarDatos();
  }, [esAdmin, usuarioActual.id]);

  // --- FUNCIONES DE FILTRADO PARA EL MODAL ---
  const agregarFiltro = (tipo, valor) => {
    const existe = filtrosActivos.some(f => f.tipo === tipo && f.valor === valor);
    if (!existe) {
      setFiltrosActivos([...filtrosActivos, { tipo, valor }]);
    }
  };

  const removerFiltro = (index) => {
    const nuevosFiltros = [...filtrosActivos];
    nuevosFiltros.splice(index, 1);
    setFiltrosActivos(nuevosFiltros);
  };

  const limpiarFiltros = () => {
    setFiltrosActivos([]);
  };

  // --- LÓGICA DE FILTRADO DE ACCIONISTAS (Buscador + Filtros Avanzados) ---
  const filteredAccionistas = useMemo(() => {
    let filtered = [...accionistasData];
    
    // 1. Buscador (Texto)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(a => 
        (a.nombre && a.nombre.toLowerCase().includes(term)) || 
        (a.codigo && a.codigo.toLowerCase().includes(term)) ||
        (a.email && a.email.toLowerCase().includes(term))
      );
    }

    // 2. Filtros Avanzados
    if (filtrosActivos.length > 0) {
      filtered = filtered.filter(accionista => {
        return filtrosActivos.every(filtro => {
          if (filtro.tipo === "estado") {
             // Asumiendo que 'estado' existe en el objeto accionista
             return accionista.estado === filtro.valor;
          }
          return true;
        });
      });
    }

    filtered.sort((a, b) => a.id - b.id);
    return filtered;
  }, [accionistasData, searchTerm, filtrosActivos]);

  // --- LÓGICA DE FILTRADO DE PAGOS (Buscador + Filtros) ---
  const pagosFiltrados = useMemo(() => {
    let filtered = [...pagosData];
    
    // 1. Filtro por Accionista seleccionado (Dropdown o contexto)
    if (accionistaSeleccionado) filtered = filtered.filter(p => p.accionistaId === accionistaSeleccionado.id);
    
    // 2. Filtro por Año
    if (selectedYearPagos !== "Todos") filtered = filtered.filter(p => (p.fechaIngresoMulta || "").includes(selectedYearPagos));

    // 3. NUEVO: Filtro por Buscador de Pagos (Nombre, Código, Referencia)
    if (searchTermPagos) {
      const term = searchTermPagos.toLowerCase();
      filtered = filtered.filter(p => 
        (p.accionista?.nombre || "").toLowerCase().includes(term) ||
        (p.accionista?.codigo || "").toLowerCase().includes(term) ||
        (p.referencia || "").toLowerCase().includes(term) ||
        (p.descripcion || "").toLowerCase().includes(term)
      );
    }

    filtered.sort((a, b) => a.id - b.id);
    return filtered;
  }, [pagosData, accionistaSeleccionado, selectedYearPagos, searchTermPagos]); // Agregado searchTermPagos

  const obtenerAccionistasPaginaActual = () => {
    const inicio = (paginaActualAccionistas - 1) * itemsPorPaginaAccionistas;
    return filteredAccionistas.slice(inicio, inicio + itemsPorPaginaAccionistas);
  };

  const obtenerPagosPaginaActual = () => {
    const inicio = (paginaActualPagos - 1) * itemsPorPaginaPagos;
    return pagosFiltrados.slice(inicio, inicio + itemsPorPaginaPagos);
  };

  const totales = {
    totalAccionistas: accionistasData.length, 
    multasTotales: pagosData.reduce((sum, p) => sum + Number(p.monto), 0),
    pagosPendientes: pagosData.filter(p => p.estado === "Pendiente" || p.estado === "En_proceso").length,
    transacciones: pagosData.length
  };

  const handleSortAccionistas = (key) => setSortConfigAccionistas({ key, direction: 'asc' });
  const handleSortPagos = (key) => setSortConfigPagos({ key, direction: 'asc' });
  const handleSeleccionarAccionistaDesdePagos = (id) => {
    const acc = accionistasData.find(a => a.id === id);
    if (acc) setAccionistaSeleccionado(acc);
  };
  
  const exportarAExcel = () => alert("Generando Excel...");
  const enviarRecordatorios = () => alert("Enviando recordatorios...");
  const marcarNotificacionLeida = (id) => setNotificaciones(prev => prev.filter(n => n.id !== id));
  const obtenerAccionistaPorId = (id) => mapaAccionistas[id];
  const calcularTotalMultas = () => totales.multasTotales;
  const calcularTotalMontosPaginaActual = () => obtenerPagosPaginaActual().reduce((s, p) => s + Number(p.monto), 0);
  const calcularTotalPagosFiltrados = () => pagosFiltrados.reduce((s, p) => s + Number(p.monto), 0);

  return (
    <div className="min-h-screen bg-aneupi-bg-tertiary p-4 md:p-8">
      {isLoading && <LoadingSpinner />}

      <Header 
        notificaciones={notificaciones} setNotificaciones={setNotificaciones}
        filtroAvanzado={filtroAvanzado} setFiltroAvanzado={setFiltroAvanzado}
        enviarRecordatorios={enviarRecordatorios} marcarNotificacionLeida={marcarNotificacionLeida}
        totalAccionistas={totales.totalAccionistas} usuario={usuarioActual}
        mostrarNotificaciones={!esAdmin} // NUEVO: Oculta campana si es admin
      />

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-aneupi-primary">
                {esAdmin ? 'Panel de Administración' : 'Mi Portal de Accionista'}
            </h1>
            <p className="text-gray-600 mt-1">
                Bienvenido, <span className="font-bold text-aneupi-secondary">{usuarioActual.nombre}</span>
            </p>
        </div>
        <button onClick={onLogout} className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm flex items-center gap-2">
            <FaSignOutAlt className="text-xs" /> Cerrar Sesión
        </button>
      </div>

      <FiltrosAvanzados 
        filtroAvanzado={filtroAvanzado} 
        setFiltroAvanzado={setFiltroAvanzado} 
        filtrosActivos={filtrosActivos} 
        agregarFiltro={agregarFiltro}
        removerFiltro={removerFiltro}
        limpiarFiltros={limpiarFiltros}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div onClick={() => esAdmin && setActiveTab("Accionistas")} className={`bg-white rounded-xl shadow-lg p-6 border border-aneupi-border-light transition-all ${esAdmin ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-aneupi-primary' : ''} group`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-aneupi-text-secondary font-medium group-hover:text-aneupi-primary">
                {esAdmin ? "Total Accionistas" : "Mi Estado"}
            </h3>
            <div className="p-2 bg-aneupi-secondary/20 rounded-lg text-aneupi-primary"><FaUser /></div>
          </div>
          <p className="text-3xl font-bold text-aneupi-primary">{esAdmin ? totales.totalAccionistas : "Activo"}</p>
        </div>

        <div onClick={() => setActiveTab("Pago de multas")} className="bg-white rounded-xl shadow-lg p-6 border border-aneupi-border-light hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-aneupi-text-secondary font-medium group-hover:text-aneupi-primary">
                {esAdmin ? "Multas Totales" : "Mis Multas"}
            </h3>
            <div className="p-2 bg-aneupi-secondary/20 rounded-lg text-aneupi-primary"><FaDollarSign /></div>
          </div>
          <p className="text-3xl font-bold text-aneupi-primary">${totales.multasTotales.toLocaleString()}</p>
        </div>

        <div onClick={() => { setActiveTab("Pago de multas"); setMostrarRecordatorios(true); }} className="bg-white rounded-xl shadow-lg p-6 border border-aneupi-border-light hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-aneupi-text-secondary font-medium group-hover:text-aneupi-primary">Pagos Pendientes</h3>
            <div className="p-2 bg-aneupi-secondary/20 rounded-lg text-aneupi-primary"><FaClock /></div>
          </div>
          <p className="text-3xl font-bold text-aneupi-primary">{totales.pagosPendientes}</p>
        </div>
      </div>

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} esAdmin={esAdmin}/>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-aneupi-border-light">
        {activeTab === "Accionistas" && esAdmin && (
          <AccionistasTab 
            searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedYear={selectedYear} setSelectedYear={setSelectedYear}
            exportandoExcel={exportandoExcel} exportarAExcel={exportarAExcel} filteredAccionistas={filteredAccionistas}
            multasPorAnio={multasPorAnio} pagosDiariosData={pagosData} anios={anios}
            obtenerAccionistasPaginaActual={obtenerAccionistasPaginaActual} calcularTotalMultas={calcularTotalMultas}
            paginaActualAccionistas={paginaActualAccionistas} setPaginaActualAccionistas={setPaginaActualAccionistas}
            totalPaginasAccionistas={Math.ceil(filteredAccionistas.length / itemsPorPaginaAccionistas) || 1}
            itemsPorPaginaAccionistas={itemsPorPaginaAccionistas} setItemsPorPaginaAccionistas={setItemsPorPaginaAccionistas} 
            totalItems={filteredAccionistas.length} obtenerAccionistaPorId={obtenerAccionistaPorId} totalAccionistas={totales.totalAccionistas}
          />
        )}
        
        {activeTab === "Accionistas" && !esAdmin && (<div className="p-10 text-center text-gray-500">No tienes permisos.</div>)}

        {/* --- PESTAÑA PAGOS (ACTUALIZADA CON BUSCADOR) --- */}
        {activeTab === "Pago de multas" && (
          <PagosTab 
            // Pasamos los nuevos props del buscador
            searchTerm={searchTermPagos}
            setSearchTerm={setSearchTermPagos}
            
            accionistaSeleccionado={accionistaSeleccionado} 
            setAccionistaSeleccionado={esAdmin ? setAccionistaSeleccionado : undefined}
            viewTypePagos={viewTypePagos} setViewTypePagos={setViewTypePagos} selectedYearPagos={selectedYearPagos}
            setSelectedYearPagos={setSelectedYearPagos} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth}
            selectedDay={selectedDay} setSelectedDay={setSelectedDay} meses={meses} dias={dias} anios={anios}
            estadisticasAccionista={estadisticasAccionista} pagosFiltrados={pagosFiltrados} mapaAccionistas={mapaAccionistas}
            handleSeleccionarAccionistaDesdePagos={handleSeleccionarAccionistaDesdePagos} sortConfigPagos={sortConfigPagos}
            handleSortPagos={handleSortPagos} obtenerPagosPaginaActual={obtenerPagosPaginaActual}
            calcularTotalMontosPaginaActual={calcularTotalMontosPaginaActual} calcularTotalPagosFiltrados={calcularTotalPagosFiltrados}
            paginaActualPagos={paginaActualPagos} setPaginaActualPagos={setPaginaActualPagos} 
            totalPaginasPagos={Math.ceil(pagosFiltrados.length / itemsPorPaginaPagos) || 1}
            itemsPorPaginaPagos={itemsPorPaginaPagos} setItemsPorPaginaPagos={setItemsPorPaginaPagos}
            totalItems={pagosFiltrados.length} totalAccionistas={totales.totalAccionistas}
            esAdmin={esAdmin} usuarioActual={usuarioActual}
          />
        )}

        {activeTab === "Estadísticas" && (
          <EstadisticasTab 
            selectedYearStats={selectedYearStats} setSelectedYearStats={setSelectedYearStats} resumenMensual={resumenMensual}
            estadisticasAvanzadas={estadisticasAvanzadas} totalAccionistas={totales.totalAccionistas}
            pagos={pagosData} anios={anios}
          />
        )}

        {activeTab === "Reportes" && (
             <ReportesTab 
                totalAccionistas={totales.totalAccionistas} pagos={pagosFiltrados} accionistas={accionistasData} anios={anios} 
            />
        )}
      </div>

      <div className="text-center text-aneupi-text-muted text-sm border-t-2 border-aneupi-primary pt-8 pb-4">
        <p>© 2026 Banco ANEUPI.</p>
      </div>
    </div>
  );
}