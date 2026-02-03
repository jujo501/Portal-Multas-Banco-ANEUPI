import { FaClipboardCheck, FaMoneyCheckAlt, FaChartBar, FaFileExport } from "react-icons/fa";

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "Accionistas", icon: <FaClipboardCheck />, color: "rgb(var(--aneupi-primary))", colorClaro: "rgb(var(--aneupi-secondary))", desc: "Multas anuales" },
    { id: "Pago de multas", icon: <FaMoneyCheckAlt />, color: "rgb(var(--aneupi-primary))", colorClaro: "rgb(var(--aneupi-secondary))", desc: "Gestión de pagos" },
    { id: "Estadísticas", icon: <FaChartBar />, color: "rgb(var(--aneupi-primary))", colorClaro: "rgb(var(--aneupi-secondary))", desc: "Análisis avanzado" },
    { id: "Reportes", icon: <FaFileExport />, color: "rgb(var(--aneupi-primary))", colorClaro: "rgb(var(--aneupi-secondary))", desc: "Generar reportes" }
  ];

  return (
    <div className="mb-10">
      <div className="flex flex-wrap gap-4 mb-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-2 px-6 py-4 rounded-xl font-medium transition-all duration-300 min-w-[160px] border ${
              activeTab === tab.id
                ? `bg-aneupi-primary text-white shadow-xl transform scale-105 border-aneupi-primary`
                : "bg-white text-aneupi-primary hover:bg-aneupi-secondary/10 shadow-sm border-aneupi-border-light hover:border-aneupi-secondary/50"
            }`}
          >
            {tab.icon}
            <span>{tab.id}</span>
            <span className="text-xs opacity-80">{tab.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;