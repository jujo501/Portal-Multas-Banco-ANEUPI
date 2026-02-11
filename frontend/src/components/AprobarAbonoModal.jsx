import { useState, useEffect } from "react";
import { FaCheckCircle, FaTimes, FaMoneyBillWave, FaEye } from "react-icons/fa";
import { toast } from "sonner";
import { pagosService } from "../services";

const AprobarAbonoModal = ({ isOpen, onClose, pago, onSuccess }) => {
  const [montoAprobado, setMontoAprobado] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && pago) {
      
      setMontoAprobado(pago.monto); 
    }
  }, [isOpen, pago]);

  if (!isOpen || !pago) return null;

  const verComprobante = () => {
    if (pago.comprobante) {
      const baseUrl = "http://localhost:3000/"; 
      const finalUrl = pago.comprobante.startsWith("http") ? pago.comprobante : `${baseUrl}${pago.comprobante}`;
      window.open(finalUrl, "_blank");
    }
  };

  const handleAprobar = async (e) => {
    e.preventDefault();
    const monto = parseFloat(montoAprobado);

    if (monto <= 0 || monto > parseFloat(pago.monto)) {
      return toast.error("Monto inválido. No puede ser mayor a la deuda.");
    }

    try {
      setLoading(true);
      await pagosService.aprobarAbono(pago.id, monto);
      
      const nuevoSaldo = parseFloat(pago.monto) - monto;
      if (nuevoSaldo <= 0.01) {
        toast.success("¡Pago completado totalmente!");
      } else {
        toast.success(`Abono registrado. Nuevo saldo: $${nuevoSaldo.toFixed(2)}`);
      }
      
      onSuccess(); 
    } catch (error) {
      console.error(error);
      toast.error("Error al aprobar el abono.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Header Azul */}
        <div className="bg-[#0c476b] p-5 text-white flex justify-between items-center">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <FaCheckCircle /> Aprobar Pago / Abono
          </h3>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Deuda Actual</p>
              <p className="text-2xl font-bold text-gray-800">${Number(pago.monto).toFixed(2)}</p>
            </div>
            {pago.comprobante && (
              <button onClick={verComprobante} className="text-blue-600 text-sm hover:underline flex items-center gap-1">
                <FaEye /> Ver Recibo
              </button>
            )}
          </div>

          <form onSubmit={handleAprobar}>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              ¿Cuánto dinero valida en el recibo?
            </label>
            
            <div className="relative mb-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">$</span>
              <input
                type="number"
                step="0.01"
                className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#0c476b] focus:ring-0 outline-none text-xl font-bold text-[#0c476b]"
                value={montoAprobado}
                onChange={(e) => setMontoAprobado(e.target.value)}
              />
            </div>
            
            {/* Calculadora visual de saldo restante */}
            <div className="text-right mb-6 text-sm">
              <span className="text-gray-500">Saldo restante será: </span>
              <span className={`font-bold ${(pago.monto - montoAprobado) <= 0 ? 'text-green-600' : 'text-orange-500'}`}>
                ${Math.max(0, pago.monto - montoAprobado).toFixed(2)}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-[#0c476b] text-white font-bold rounded-xl hover:bg-[#0a3b5a] transition-colors shadow-lg disabled:opacity-50"
              >
                {loading ? "Procesando..." : "Confirmar Aprobación"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AprobarAbonoModal;