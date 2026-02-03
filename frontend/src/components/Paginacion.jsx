import { FaAngleDoubleLeft, FaChevronLeft, FaChevronRight, FaAngleDoubleRight, FaListOl, FaDollarSign } from "react-icons/fa";

const Paginacion = ({ 
  tipo,
  paginaActual,
  setPaginaActual,
  totalPaginas,
  itemsPorPagina,
  setItemsPorPagina,
  totalItems,
  itemsPaginaActual,
  calcularTotalMontosPaginaActual,
  calcularTotalPagosFiltrados
}) => {
  const maxPaginasVisibles = 5;
  
  let inicioPagina = Math.max(1, paginaActual - Math.floor(maxPaginasVisibles / 2));
  let finPagina = Math.min(totalPaginas, inicioPagina + maxPaginasVisibles - 1);
  
  if (finPagina - inicioPagina + 1 < maxPaginasVisibles) {
    inicioPagina = Math.max(1, finPagina - maxPaginasVisibles + 1);
  }
  
  const paginas = [];
  for (let i = inicioPagina; i <= finPagina; i++) {
    paginas.push(i);
  }
  
  const handleItemsPerPageChange = (e) => {
    const value = Number(e.target.value);
    setItemsPorPagina(value);
    localStorage.setItem(`itemsPorPagina${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`, value.toString());
  };
  
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white border-t border-aneupi-border-light">
      {/* Barra de navegación a la IZQUIERDA */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setPaginaActual(1)}
          disabled={paginaActual === 1}
          className="p-2 text-aneupi-text-muted hover:text-[#0D4367] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Primera página"
        >
          <FaAngleDoubleLeft />
        </button>
        
        <button
          onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
          disabled={paginaActual === 1}
          className="p-2 text-aneupi-text-muted hover:text-[#0D4367] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Página anterior"
        >
          <FaChevronLeft />
        </button>
        
        {inicioPagina > 1 && (
          <span className="px-2 text-aneupi-text-muted">...</span>
        )}
        
        {paginas.map(pagina => (
          <button
            key={pagina}
            onClick={() => setPaginaActual(pagina)}
            className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
              pagina === paginaActual
                ? 'bg-[#0D4367] text-white font-bold shadow-sm'
                : 'text-aneupi-text-secondary hover:bg-[#F0F1F5] hover:text-[#0D4367] border border-aneupi-border-light'
            }`}
          >
            {pagina}
          </button>
        ))}
        
        {finPagina < totalPaginas && (
          <span className="px-2 text-aneupi-text-muted">...</span>
        )}
        
        <button
          onClick={() => setPaginaActual(Math.min(totalPaginas, paginaActual + 1))}
          disabled={paginaActual === totalPaginas}
          className="p-2 text-aneupi-text-muted hover:text-[#0D4367] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Página siguiente"
        >
          <FaChevronRight />
        </button>
        
        <button
          onClick={() => setPaginaActual(totalPaginas)}
          disabled={paginaActual === totalPaginas}
          className="p-2 text-aneupi-text-muted hover:text-[#0D4367] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Última página"
        >
          <FaAngleDoubleRight />
        </button>
      </div>
      
      {/* Centro: información y selección de items por página */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-aneupi-text-muted">
          <FaListOl className="text-[#0D4367]" />
          <span>Mostrando <span className="font-bold">{itemsPaginaActual}</span> de <span className="font-bold">{totalItems}</span> {tipo === "accionistas" ? "accionistas" : "pagos"}</span>
        </div>
        
        <select
          value={itemsPorPagina}
          onChange={handleItemsPerPageChange}
          className="px-3 py-1 border border-aneupi-border-light rounded text-sm bg-white text-aneupi-text-secondary hover:border-[#0D4367] focus:border-[#0D4367] focus:ring-1 focus:ring-[#0D4367] transition-colors"
        >
          {tipo === "accionistas" ? (
            <>
              <option value={5}>5 por página</option>
              <option value={10}>10 por página</option>
              <option value={15}>15 por página</option>
            </>
          ) : (
            <>
              <option value={10}>10 por página</option>
              <option value={15}>15 por página</option>
              <option value={20}>20 por página</option>
            </>
          )}
        </select>
      </div>
      
      {/* Derecha: información adicional */}
      <div className="flex items-center gap-4">
        {tipo === "pagos" && calcularTotalPagosFiltrados && (
          <div className="flex items-center gap-2 px-3 py-1 bg-[#0D4367] text-white rounded text-sm border border-[#0B3A5C]">
            <FaDollarSign className="text-xs" />
            <span className="font-bold">
              Total filtrado: ${calcularTotalPagosFiltrados().toLocaleString()}
            </span>
          </div>
        )}

        <div className="text-sm text-aneupi-text-muted">
          Página <span className="font-bold">{paginaActual}</span> de <span className="font-bold">{totalPaginas}</span>
        </div>
      </div>
    </div>
  );
};

export default Paginacion;