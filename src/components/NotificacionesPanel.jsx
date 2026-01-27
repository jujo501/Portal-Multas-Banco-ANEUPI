import { useState } from "react";
import { FaBell } from "react-icons/fa";

const NotificacionesPanel = ({ notificaciones, marcarNotificacionLeida }) => {
  const [mostrarPanel, setMostrarPanel] = useState(false);
  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida).length;
  
  return (
    <div className="relative">
      <button
        onClick={() => setMostrarPanel(!mostrarPanel)}
        className="relative p-2 text-[#0D4367] hover:text-[#0B3A5C] hover:bg-[#E8F1F7] rounded-lg transition-colors"
      >
        <FaBell className="text-xl" />
        {notificacionesNoLeidas > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notificacionesNoLeidas}
          </span>
        )}
      </button>
      
      {mostrarPanel && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-aneupi-border-light z-50">
          <div className="p-4 border-b border-aneupi-border-light">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#0D4367]">Notificaciones</h3>
              <span className="text-sm text-aneupi-text-muted">{notificacionesNoLeidas} no leídas</span>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notificaciones.length === 0 ? (
              <div className="p-4 text-center text-aneupi-text-muted">
                No hay notificaciones
              </div>
            ) : (
              notificaciones.map(notif => (
                <div
                  key={notif.id}
                  className={`p-4 border-b border-aneupi-border-light hover:bg-aneupi-bg-tertiary cursor-pointer ${
                    !notif.leida ? 'bg-[#E8F1F7]' : ''
                  }`}
                  onClick={() => marcarNotificacionLeida(notif.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      notif.tipo === "pago_pendiente" ? 'bg-red-100 text-red-600' :
                      notif.tipo === "recordatorio" ? 'bg-slate-100 text-slate-600' :
                      notif.tipo === "alerta" ? 'bg-orange-100 text-orange-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      <FaBell className="text-sm" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-[#0D4367]">{notif.titulo}</h4>
                        <span className="text-xs text-aneupi-text-muted">{notif.fecha}</span>
                      </div>
                      <p className="text-sm text-aneupi-text-secondary mt-1">{notif.mensaje}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          notif.prioridad === "alta" ? 'bg-red-100 text-red-700' :
                          notif.prioridad === "media" ? 'bg-slate-100 text-slate-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {notif.prioridad}
                        </span>
                        {!notif.leida && (
                          <span className="text-xs text-[#0D4367]">Nuevo</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-4 border-t border-aneupi-border-light">
            <button
              onClick={() => {
                notificaciones.forEach(notif => marcarNotificacionLeida(notif.id));
                setMostrarPanel(false);
              }}
              className="w-full px-4 py-2 bg-[#0D4367] text-white rounded-lg hover:bg-[#0B3A5C] transition-colors"
            >
              Marcar todas como leídas
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificacionesPanel;