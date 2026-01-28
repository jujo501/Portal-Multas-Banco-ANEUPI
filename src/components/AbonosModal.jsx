import { FaTimes, FaCalendarAlt, FaDollarSign, FaReceipt } from "react-icons/fa";
import { useEffect } from "react";

const AbonosModal = ({ isOpen, onClose, multa, abonos }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const totalAbonado = abonos.reduce((sum, abono) => sum + abono.monto, 0);
  const saldoPendiente = multa.monto - totalAbonado;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="bg-aneupi-primary text-white p-6 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold">Abonos Realizados</h3>
            <p className="text-white/80 mt-1">Multa #{multa.id} - {multa.accionista}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-aneupi-bg-tertiary p-4 rounded-lg border-2 border-aneupi-primary/20">
              <p className="text-sm text-aneupi-primary font-semibold mb-1">Monto Total</p>
              <p className="text-2xl font-bold text-aneupi-primary">${multa.monto.toLocaleString()}</p>
            </div>
            <div className="bg-aneupi-bg-tertiary p-4 rounded-lg border-2 border-aneupi-primary/30">
              <p className="text-sm text-aneupi-primary font-semibold mb-1">Total Abonado</p>
              <p className="text-2xl font-bold text-aneupi-primary">${totalAbonado.toLocaleString()}</p>
            </div>
            <div className="bg-aneupi-bg-tertiary p-4 rounded-lg border-2 border-aneupi-primary/20">
              <p className="text-sm text-aneupi-primary font-semibold mb-1">Saldo Pendiente</p>
              <p className="text-2xl font-bold text-aneupi-primary">${saldoPendiente.toLocaleString()}</p>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-lg font-semibold text-aneupi-primary mb-3">Historial de Abonos</h4>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {abonos.length === 0 ? (
                <p className="text-center text-aneupi-text-muted py-8">No hay abonos registrados</p>
              ) : (
                abonos.map((abono, index) => (
                  <div 
                    key={index}
                    className="bg-aneupi-bg-tertiary p-4 rounded-lg border-2 border-aneupi-primary/20 hover:border-aneupi-secondary/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FaCalendarAlt className="text-aneupi-primary" />
                          <span className="font-semibold text-aneupi-primary">{abono.fecha}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaDollarSign className="text-aneupi-primary" />
                          <span className="text-2xl font-bold text-aneupi-primary">${abono.monto.toLocaleString()}</span>
                        </div>
                        {abono.referencia && (
                          <div className="flex items-center gap-2 mt-2">
                            <FaReceipt className="text-aneupi-text-muted text-sm" />
                            <span className="text-sm text-aneupi-text-muted">{abono.referencia}</span>
                          </div>
                        )}
                      </div>
                      <span className="bg-aneupi-secondary/20 text-aneupi-primary px-3 py-1 rounded-full text-sm font-medium border-2 border-aneupi-secondary/50">
                        Abono #{index + 1}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-aneupi-bg-tertiary p-4 flex justify-end border-t-2 border-aneupi-primary/20">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-aneupi-primary text-white rounded-lg hover:bg-aneupi-primary-dark transition-colors font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AbonosModal;
