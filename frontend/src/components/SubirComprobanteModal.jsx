import { useState } from "react";
import { FaCloudUploadAlt, FaTimes, FaImage, FaCheck } from "react-icons/fa";
import { toast } from "sonner";
import { pagosService } from "../services";

export default function SubirComprobanteModal({ isOpen, onClose, pago, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  if (!isOpen || !pago) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected)); 
    }
  };

  const handleSubmit = async () => {
    if (!file) return toast.error("Selecciona una imagen primero");

    setUploading(true);
    try {
      await pagosService.subirComprobante(pago.id, file);
      toast.success("¡Comprobante enviado! Esperando aprobación.");
      onUploadSuccess(); 
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="bg-aneupi-primary text-white p-4 flex justify-between items-center">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <FaCloudUploadAlt /> Subir Comprobante
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-white transition">
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Sube una foto clara del recibo o transferencia para la multa: 
            <span className="font-bold block text-gray-800 mt-1">{pago.descripcion} (${pago.monto})</span>
          </p>

          {/* Área de Drop/Input */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition relative">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            {preview ? (
              <div className="relative">
                <img src={preview} alt="Vista previa" className="max-h-48 mx-auto rounded-lg shadow-md" />
                <p className="text-xs text-green-600 mt-2 font-bold flex items-center justify-center gap-1">
                  <FaCheck /> Imagen seleccionada
                </p>
              </div>
            ) : (
              <div className="text-gray-400 flex flex-col items-center">
                <FaImage className="text-4xl mb-2" />
                <span className="text-sm font-medium">Toca para seleccionar foto</span>
                <span className="text-xs mt-1">JPG, PNG, JPEG</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition">
            Cancelar
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={uploading || !file}
            className={`px-6 py-2 rounded-lg text-white font-bold text-sm shadow-lg transition flex items-center gap-2
              ${uploading || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-aneupi-primary hover:bg-aneupi-primary-dark hover:scale-105'}
            `}
          >
            {uploading ? "Subiendo..." : "Enviar Comprobante"}
          </button>
        </div>
      </div>
    </div>
  );
}