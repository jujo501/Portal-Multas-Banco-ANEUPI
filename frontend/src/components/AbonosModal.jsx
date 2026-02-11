import { useState, useEffect } from "react";
import { FaMoneyBillWave, FaFileUpload, FaTimes, FaCheckCircle } from "react-icons/fa";
import { toast } from "sonner";
import { pagosService } from "../services";

const AbonosModal = ({ isOpen, onClose, pago, onUploadSuccess }) => {
  const [tipoPago, setTipoPago] = useState("total"); 
  const [montoAbono, setMontoAbono] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && pago) {
      setMontoAbono("");
      setTipoPago("total");
      setArchivo(null);
    }
  }, [isOpen, pago]);

  if (!isOpen || !pago) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!archivo) return toast.error("Debes subir el comprobante");

    
    const montoPagar = tipoPago === "total" ? Number(pago.monto) : Number(montoAbono);
    
    if (montoPagar <= 0) return toast.error("El monto debe ser mayor a 0");
    if (montoPagar > Number(pago.monto)) return toast.error("No puedes abonar más de la deuda pendiente");

    try {
      setLoading(true);
      
      await pagosService.subirComprobante(pago.id, archivo, montoPagar);
      toast.success(tipoPago === "total" ? "Pago total enviado a revisión" : "Abono enviado a revisión");
      onUploadSuccess(); 
    } catch (error) {
      console.error(error);
      toast.error("Error al subir el comprobante");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-aneupi-primary p-6 text-white flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <FaMoneyBillWave /> Registrar Pago
            </h3>
            <p className="text-white/80 text-sm mt-1">{pago.descripcion}</p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Resumen de Deuda */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center">
            <span className="text-blue-800 font-medium">Deuda Pendiente:</span>
            <span className="text-2xl font-bold text-aneupi-primary">${Number(pago.monto).toFixed(2)}</span>
          </div>

          {/* Selección de Tipo de Pago */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700">¿Cuánto deseas pagar?</label>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTipoPago("total")}
                className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                  tipoPago === "total" 
                    ? "border-aneupi-primary bg-blue-50 text-aneupi-primary" 
                    : "border-gray-200 hover:border-gray-300 text-gray-500"
                }`}
              >
                <span className="font-bold text-sm">Pago Total</span>
                <span className="text-xs">${Number(pago.monto).toFixed(2)}</span>
                {tipoPago === "total" && <FaCheckCircle className="text-aneupi-primary mt-1" />}
              </button>

              <button
                type="button"
                onClick={() => setTipoPago("parcial")}
                className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                  tipoPago === "parcial" 
                    ? "border-aneupi-primary bg-blue-50 text-aneupi-primary" 
                    : "border-gray-200 hover:border-gray-300 text-gray-500"
                }`}
              >
                <span className="font-bold text-sm">Abono Parcial</span>
                <span className="text-xs">Otra cantidad</span>
                {tipoPago === "parcial" && <FaCheckCircle className="text-aneupi-primary mt-1" />}
              </button>
            </div>
          </div>

          {/* Input para Monto Parcial */}
          {tipoPago === "parcial" && (
            <div className="animate-fade-in-down">
              <label className="block text-sm font-medium text-gray-700 mb-2">Ingresa el monto a abonar ($)</label>
              <input
                type="number"
                step="0.01"
                min="1"
                max={pago.monto}
                value={montoAbono}
                onChange={(e) => setMontoAbono(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-aneupi-primary focus:border-aneupi-primary outline-none text-lg font-bold text-gray-800"
                placeholder="0.00"
                required
              />
              <p className="text-xs text-gray-500 mt-1">El saldo restante será: <span className="font-bold">${(Number(pago.monto) - Number(montoAbono || 0)).toFixed(2)}</span></p>
            </div>
          )}

          {/* Subir Archivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Comprobante de Transferencia</label>
            <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer group">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setArchivo(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required
              />
              <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-aneupi-primary">
                <FaFileUpload className="text-2xl" />
                <span className="text-sm font-medium">
                  {archivo ? archivo.name : "Click para subir imagen o PDF"}
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-aneupi-primary text-white font-bold rounded-xl hover:bg-aneupi-primary-dark transition-colors shadow-lg disabled:opacity-70"
          >
            {loading ? "Enviando..." : `Confirmar Pago de $${tipoPago === 'total' ? Number(pago.monto).toFixed(2) : Number(montoAbono).toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AbonosModal;