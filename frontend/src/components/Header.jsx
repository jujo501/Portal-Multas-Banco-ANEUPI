import { useState } from "react";
import { FaBuilding, FaDatabase, FaFilter, FaBell, FaUser, FaBars } from "react-icons/fa";

const Header = ({ 
  notificaciones = [], 
  setNotificaciones, 
  filtroAvanzado, 
  setFiltroAvanzado, 
  enviarRecordatorios,
  marcarNotificacionLeida,
  totalAccionistas,
  usuario = { rol: 'USER', nombre: '' } 
}) => {
  
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const esAdmin = usuario.rol === 'ADMIN' || usuario.rol === 'SUPERADMIN';
  
  // Filtramos las no leídas
  const noLeidas = notificaciones.filter(n => !n.leida).length;

  return (
    <div className="mb-10 animate-fade-in-down">
      {/* --- BLOQUE SUPERIOR --- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        
        {/* Logo y Título */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-aneupi-primary rounded-xl shadow-lg border border-aneupi-primary-dark">
            <FaBuilding className="text-3xl text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-aneupi-primary">
              Portal de Multas - Banco ANEUPI
            </h1>
            <p className="text-aneupi-text-secondary mt-1 md:mt-3 text-sm md:text-lg">
              Sistema especializado para la gestión y seguimiento de multas.
            </p>
          </div>
        </div>

        {/* Panel Derecho (User Info + Notificaciones) */}
        <div className="flex items-center gap-4 self-end md:self-auto">
          
          {/* Badge Total Accionistas (Solo Admin) */}
          {esAdmin && (
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-aneupi-primary rounded-full text-aneupi-primary shadow-sm">
              <FaDatabase />
              <span className="font-bold">{totalAccionistas} Accionistas</span>
            </div>
          )}

          {/* Información del Usuario */}
          <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
             <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-aneupi-primary">{usuario.nombre}</p>
                <p className="text-[10px] text-gray-500">{esAdmin ? 'Administrador' : 'Accionista'}</p>
             </div>
             <div className="w-8 h-8 bg-aneupi-primary text-white rounded-full flex items-center justify-center">
                <FaUser className="text-xs" />
             </div>
          </div>

          {/* --- CAMPANA DE NOTIFICACIONES (Solo Accionistas) --- */}
          {!esAdmin && (
            <div className="relative">
              <button 
                onClick={() => setShowNotifPanel(!showNotifPanel)}
                className="p-3 bg-white text-aneupi-text-muted hover:text-aneupi-primary border border-gray-200 rounded-full shadow-sm transition-colors relative"
              >
                <FaBell className="text-xl" />
                {noLeidas > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                    {noLeidas}
                  </span>
                )}
              </button>

              {/* Dropdown de Notificaciones */}
              {showNotifPanel && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                  <div className="p-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                     <h3 className="font-bold text-gray-700 text-sm">Notificaciones</h3>
                     <span className="text-xs text-gray-400">{noLeidas} nuevas</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                     {notificaciones.length === 0 ? (
                        <div className="p-4 text-center text-gray-400 text-sm">No tienes notificaciones.</div>
                     ) : (
                        notificaciones.map(n => (
                          <div 
                            key={n.id} 
                            onClick={() => marcarNotificacionLeida(n.id)}
                            className={`p-3 border-b border-gray-50 hover:bg-blue-50 cursor-pointer transition-colors ${!n.leida ? 'bg-blue-50/30' : ''}`}
                          >
                              <div className="flex justify-between items-start mb-1">
                                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${n.prioridad === 'alta' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                                      {n.tipo}
                                  </span>
                                  <span className="text-[10px] text-gray-400">{n.fecha}</span>
                              </div>
                              <p className="text-sm text-gray-700 leading-tight">{n.mensaje}</p>
                          </div>
                        ))
                     )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-aneupi-border-light">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FaBuilding className="text-aneupi-primary text-xl" />
            <div>
              <h2 className="text-xl font-semibold text-aneupi-primary">Panel de Control</h2>
              <p className="text-aneupi-primary/80 text-sm">
                {esAdmin ? "Gestión global de accionistas y multas." : "Consulta tu estado y realiza tus pagos."}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFiltroAvanzado(!filtroAvanzado)}
              className="px-4 py-2 bg-white text-aneupi-primary border border-aneupi-primary rounded-lg hover:bg-aneupi-primary hover:text-white flex items-center gap-2 transition-colors font-medium shadow-sm"
            >
              <FaFilter /> {filtroAvanzado ? 'Ocultar Filtros' : 'Filtros Avanzados'}
            </button>
            
            {/* Botón Recordatorios (Solo Admin) */}
            {esAdmin && (
              <button
                onClick={enviarRecordatorios}
                className="px-4 py-2 bg-aneupi-primary text-white rounded-lg hover:bg-aneupi-primary-dark flex items-center gap-2 transition-colors font-medium shadow-md"
              >
                <FaBell /> Enviar Recordatorios
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;