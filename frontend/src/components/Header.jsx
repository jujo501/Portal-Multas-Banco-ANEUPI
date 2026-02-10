import { FaBuilding, FaDatabase, FaFilter, FaBell, FaUser } from "react-icons/fa";
import NotificacionesPanel from "./NotificacionesPanel";

const Header = ({ 
  notificaciones, 
  setNotificaciones, 
  filtroAvanzado, 
  setFiltroAvanzado, 
  enviarRecordatorios,
  marcarNotificacionLeida,
  totalAccionistas
}) => {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-aneupi-primary rounded-xl shadow-lg border border-aneupi-primary-dark">
            <FaBuilding className="text-3xl text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-aneupi-primary">
              Portal de Multas - Banco ANEUPI
            </h1>
            <p className="text-aneupi-text-secondary mt-3 text-lg">
              Sistema especializado para la gestión y seguimiento de multas aplicadas a los accionistas
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <div className="badge-aneupi">
              <FaDatabase className="text-aneupi-primary" />
              <span className="font-bold">{totalAccionistas} Accionistas</span>
            </div>
            <NotificacionesPanel 
              notificaciones={notificaciones}
              marcarNotificacionLeida={marcarNotificacionLeida}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-aneupi-border-light">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FaBuilding className="text-aneupi-primary text-xl" />
            <div>
              <h2 className="text-xl font-semibold text-aneupi-primary">Sistema Especializado - Banco ANEUPI</h2>
              <p className="text-aneupi-primary">
                Sistema especializado para la gestión y seguimiento de multas aplicadas a los accionistas
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFiltroAvanzado(!filtroAvanzado)}
              className="px-4 py-2 bg-white text-aneupi-primary border border-aneupi-primary rounded-lg hover:bg-aneupi-primary hover:text-white flex items-center gap-2 transition-colors"
            >
              <FaFilter /> {filtroAvanzado ? 'Ocultar Filtros' : 'Filtros Avanzados'}
            </button>
            <button
              onClick={enviarRecordatorios}
              className="btn-aneupi-secondary flex items-center gap-2"
            >
              <FaBell /> Enviar Recordatorios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;