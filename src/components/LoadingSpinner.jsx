const LoadingSpinner = ({ totalAccionistas = 20 }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-xl border border-aneupi-border-light">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#0D4367] mb-4"></div>
      <p className="text-aneupi-text-secondary font-medium">Cargando {totalAccionistas} accionistas...</p>
      <p className="text-aneupi-text-muted text-sm mt-2">Por favor espera unos segundos</p>
    </div>
  </div>
);

export default LoadingSpinner;