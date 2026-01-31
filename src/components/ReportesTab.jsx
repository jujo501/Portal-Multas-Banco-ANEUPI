import { useState } from "react";
import { FaFileExport, FaMoneyCheckAlt, FaChartBar, FaUser, FaDownload, FaDatabase, FaFilter, FaEye, FaFilePdf, FaFileExcel, FaFileCsv, FaCheckCircle } from "react-icons/fa";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ReportesTab = ({ totalAccionistas = 10, pagos = [], accionistas = [], anios = [] }) => {
  const [reporteGenerando, setReporteGenerando] = useState(false);
  const [tipoReporteSeleccionado, setTipoReporteSeleccionado] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filtros, setFiltros] = useState({
    anio: "Todos",
    estado: "Todos",
    formato: "pdf"
  });
  
  console.log('Total pagos disponibles:', pagos.length);
  console.log('Filtros actuales:', filtros);
  
  const generarReporte = (tipo) => {
    setTipoReporteSeleccionado(tipo);
    setReporteGenerando(true);
    
    setTimeout(() => {
      const pagosFiltrados = pagos.filter(p => {
        if (filtros.anio !== "Todos" && !p.fechaIngresoMulta?.includes(filtros.anio)) return false;
        if (filtros.estado !== "Todos" && p.estado !== filtros.estado) return false;
        return true;
      });

      const accionistasFiltrados = accionistas.filter(a => {
        const pagosAccionista = pagosFiltrados.filter(p => p.accionistaId === a.id);
        return pagosAccionista.length > 0;
      });

      let contenido = '';
      const fecha = new Date().toLocaleDateString('es-ES');
      const hora = new Date().toLocaleTimeString('es-ES');

      if (tipo === 'completo') {
        contenido = `REPORTE COMPLETO - BANCO ANEUPI\n`;
        contenido += `Fecha de generación: ${fecha} ${hora}\n`;
        contenido += `Período: ${filtros.anio}\n`;
        contenido += `Estado: ${filtros.estado}\n\n`;
        contenido += `=== RESUMEN GENERAL ===\n`;
        contenido += `Total Accionistas: ${totalAccionistas}\n`;
        contenido += `Total Pagos: ${pagosFiltrados.length}\n`;
        contenido += `Monto Total: $${pagosFiltrados.reduce((sum, p) => sum + p.monto, 0).toLocaleString()}\n\n`;
        
        contenido += `=== DATOS DE ACCIONISTAS ===\n`;
        accionistasFiltrados.forEach(a => {
          const pagosAcc = pagosFiltrados.filter(p => p.accionistaId === a.id);
          const totalAcc = pagosAcc.reduce((sum, p) => sum + p.monto, 0);
          contenido += `\n${a.nombre} (${a.codigo})\n`;
          contenido += `  Email: ${a.email}\n`;
          contenido += `  Teléfono: ${a.telefono}\n`;
          contenido += `  Estado: ${a.estado}\n`;
          contenido += `  Fecha Ingreso: ${a.fechaIngreso}\n`;
          contenido += `  Total Multas: $${totalAcc.toLocaleString()}\n`;
          contenido += `  Cantidad Pagos: ${pagosAcc.length}\n`;
        });
        
        contenido += `\n=== HISTORIAL DE MULTAS ===\n`;
        pagosFiltrados.forEach(p => {
          const acc = accionistas.find(a => a.id === p.accionistaId);
          contenido += `${p.fechaIngresoMulta} - ${acc?.nombre}: $${p.monto} (${p.estado})\n`;
        });
        
        const completados = pagosFiltrados.filter(p => p.estado === 'Completado').length;
        const pendientes = pagosFiltrados.filter(p => p.estado === 'Pendiente').length;
        const tasaCumplimiento = pagosFiltrados.length > 0 ? ((completados/pagosFiltrados.length)*100).toFixed(1) : 0;
        
        contenido += `\n=== ESTADÍSTICAS GENERALES ===\n`;
        contenido += `Pagos Completados: ${completados}\n`;
        contenido += `Pagos Pendientes: ${pendientes}\n`;
        contenido += `Tasa de Cumplimiento: ${tasaCumplimiento}%\n`;
        
        contenido += `\n=== ANÁLISIS DE CUMPLIMIENTO ===\n`;
        accionistasFiltrados.forEach(a => {
          const pagosAcc = pagosFiltrados.filter(p => p.accionistaId === a.id);
          const compAcc = pagosAcc.filter(p => p.estado === 'Completado').length;
          const tasaAcc = pagosAcc.length > 0 ? ((compAcc/pagosAcc.length)*100).toFixed(1) : 0;
          contenido += `${a.nombre}: ${tasaAcc}% (${compAcc}/${pagosAcc.length})\n`;
        });
      } else if (tipo === 'pagos') {
        contenido = `REPORTE DE PAGOS - BANCO ANEUPI\n`;
        contenido += `Fecha de generación: ${fecha} ${hora}\n`;
        contenido += `Período: ${filtros.anio}\n`;
        contenido += `Estado: ${filtros.estado}\n\n`;
        
        const completados = pagosFiltrados.filter(p => p.estado === 'Completado');
        const pendientes = pagosFiltrados.filter(p => p.estado === 'Pendiente');
        
        contenido += `=== PAGOS COMPLETADOS (${completados.length}) ===\n`;
        contenido += `ID,Accionista,Fecha Ingreso,Fecha Pago,Monto,Método,Descripción\n`;
        completados.forEach(p => {
          const acc = accionistas.find(a => a.id === p.accionistaId);
          contenido += `${p.id},${acc?.nombre || 'N/A'},${p.fechaIngresoMulta},${p.fechaPago},$${p.monto},${p.metodo},${p.descripcion}\n`;
        });
        
        contenido += `\n=== PAGOS PENDIENTES (${pendientes.length}) ===\n`;
        contenido += `ID,Accionista,Fecha Ingreso,Monto,Descripción\n`;
        pendientes.forEach(p => {
          const acc = accionistas.find(a => a.id === p.accionistaId);
          contenido += `${p.id},${acc?.nombre || 'N/A'},${p.fechaIngresoMulta},$${p.monto},${p.descripcion}\n`;
        });
        
        contenido += `\n=== MÉTODOS DE PAGO ===\n`;
        const metodos = {};
        completados.forEach(p => {
          metodos[p.metodo] = (metodos[p.metodo] || 0) + 1;
        });
        Object.entries(metodos).forEach(([metodo, cantidad]) => {
          contenido += `${metodo}: ${cantidad} pagos\n`;
        });
        
        contenido += `\n=== MONTOS POR PERÍODO ===\n`;
        const porAnio = {};
        pagosFiltrados.forEach(p => {
          const anio = p.fechaIngresoMulta?.split('-')[0] || 'Sin fecha';
          porAnio[anio] = (porAnio[anio] || 0) + p.monto;
        });
        Object.entries(porAnio).forEach(([anio, monto]) => {
          contenido += `${anio}: $${monto.toLocaleString()}\n`;
        });
      } else if (tipo === 'estadistico') {
        const completados = pagosFiltrados.filter(p => p.estado === 'Completado').length;
        const pendientes = pagosFiltrados.filter(p => p.estado === 'Pendiente').length;
        const totalMonto = pagosFiltrados.reduce((sum, p) => sum + p.monto, 0);
        const promedio = pagosFiltrados.length > 0 ? totalMonto / pagosFiltrados.length : 0;
        
        contenido = `REPORTE ESTADÍSTICO - BANCO ANEUPI\n`;
        contenido += `Fecha de generación: ${fecha} ${hora}\n`;
        contenido += `Período: ${filtros.anio}\n\n`;
        
        contenido += `=== GRÁFICOS DE TENDENCIAS ===\n`;
        const porAnio = {};
        pagosFiltrados.forEach(p => {
          const anio = p.fechaIngresoMulta?.split('-')[0] || 'Sin fecha';
          if (!porAnio[anio]) porAnio[anio] = { total: 0, cantidad: 0 };
          porAnio[anio].total += p.monto;
          porAnio[anio].cantidad++;
        });
        Object.entries(porAnio).sort().forEach(([anio, datos]) => {
          contenido += `${anio}: $${datos.total.toLocaleString()} (${datos.cantidad} pagos)\n`;
        });
        
        contenido += `\n=== COMPARATIVAS ANUALES ===\n`;
        const aniosOrdenados = Object.keys(porAnio).sort();
        for (let i = 1; i < aniosOrdenados.length; i++) {
          const anioActual = aniosOrdenados[i];
          const anioAnterior = aniosOrdenados[i-1];
          const cambio = porAnio[anioActual].total - porAnio[anioAnterior].total;
          const porcentaje = ((cambio / porAnio[anioAnterior].total) * 100).toFixed(1);
          contenido += `${anioAnterior} vs ${anioActual}: ${cambio >= 0 ? '+' : ''}$${cambio.toLocaleString()} (${porcentaje}%)\n`;
        }
        
        contenido += `\n=== DISTRIBUCIÓN DE PAGOS ===\n`;
        contenido += `Total Pagos: ${pagosFiltrados.length}\n`;
        contenido += `Pagos Completados: ${completados} (${((completados/pagosFiltrados.length)*100).toFixed(1)}%)\n`;
        contenido += `Pagos Pendientes: ${pendientes} (${((pendientes/pagosFiltrados.length)*100).toFixed(1)}%)\n`;
        
        contenido += `\n=== PROMEDIOS Y TOTALES ===\n`;
        contenido += `Monto Total: $${totalMonto.toLocaleString()}\n`;
        contenido += `Promedio por Pago: $${Math.round(promedio).toLocaleString()}\n`;
        contenido += `Promedio por Accionista: $${Math.round(totalMonto/totalAccionistas).toLocaleString()}\n`;
        
        accionistasFiltrados.forEach(a => {
          const pagosAcc = pagosFiltrados.filter(p => p.accionistaId === a.id);
          const totalAcc = pagosAcc.reduce((sum, p) => sum + p.monto, 0);
          contenido += `${a.nombre}: $${totalAcc.toLocaleString()} (${pagosAcc.length} pagos)\n`;
        });
      } else if (tipo === 'accionistas') {
        contenido = `REPORTE DE ACCIONISTAS - BANCO ANEUPI\n`;
        contenido += `Fecha de generación: ${fecha} ${hora}\n\n`;
        
        contenido += `=== DATOS PERSONALES ===\n`;
        contenido += `ID,Nombre,Código,Email,Teléfono,Estado,Tipo,Fecha Ingreso\n`;
        accionistas.forEach(a => {
          contenido += `${a.id},${a.nombre},${a.codigo},${a.email},${a.telefono},${a.estado},${a.tipoAccionista || 'Principal'},${a.fechaIngreso}\n`;
        });
        
        contenido += `\n=== HISTORIAL DE MULTAS ===\n`;
        accionistas.forEach(a => {
          const pagosAcc = pagosFiltrados.filter(p => p.accionistaId === a.id);
          if (pagosAcc.length > 0) {
            contenido += `\n${a.nombre}:\n`;
            pagosAcc.forEach(p => {
              contenido += `  ${p.fechaIngresoMulta}: $${p.monto} - ${p.descripcion} (${p.estado})\n`;
            });
          }
        });
        
        contenido += `\n=== ESTADO DE CUENTA ===\n`;
        contenido += `Accionista,Total Multas,Pagos Completados,Pagos Pendientes,Saldo Pendiente\n`;
        accionistas.forEach(a => {
          const pagosAcc = pagosFiltrados.filter(p => p.accionistaId === a.id);
          const totalAcc = pagosAcc.reduce((sum, p) => sum + p.monto, 0);
          const compAcc = pagosAcc.filter(p => p.estado === 'Completado').length;
          const pendAcc = pagosAcc.filter(p => p.estado === 'Pendiente').length;
          const saldoPend = pagosAcc.filter(p => p.estado === 'Pendiente').reduce((sum, p) => sum + p.monto, 0);
          contenido += `${a.nombre},$${totalAcc.toLocaleString()},${compAcc},${pendAcc},$${saldoPend.toLocaleString()}\n`;
        });
        
        contenido += `\n=== INFORMACIÓN DE CONTACTO ===\n`;
        contenido += `Nombre,Email,Teléfono,Dirección\n`;
        accionistas.forEach(a => {
          contenido += `${a.nombre},${a.email},${a.telefono},${a.direccion || 'N/A'}\n`;
        });
      }

      const formato = filtros.formato.toLowerCase();
      const nombreArchivo = `Reporte_${tipo.charAt(0).toUpperCase() + tipo.slice(1)}_ANEUPI_${filtros.anio}_${new Date().toISOString().split('T')[0]}`;
      
      if (formato === 'pdf') {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        let finalY = 25;
        
        // Encabezado
        doc.setFillColor(12, 71, 107);
        doc.rect(0, 0, pageWidth, 35, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont(undefined, 'bold');
        doc.text('BANCO ANEUPI', pageWidth / 2, 15, { align: 'center' });
        doc.setFontSize(14);
        doc.text(`Reporte ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`, pageWidth / 2, 25, { align: 'center' });
        
        finalY = 45;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.text(`Fecha: ${fecha} ${hora}`, 20, finalY);
        doc.text(`Período: ${filtros.anio} | Estado: ${filtros.estado}`, pageWidth - 20, finalY, { align: 'right' });
        finalY += 10;
        
        if (tipo === 'completo') {
          // Resumen
          autoTable(doc, {
            startY: finalY,
            head: [['Métrica', 'Valor']],
            body: [
              ['Total Accionistas', totalAccionistas.toString()],
              ['Total Pagos', pagosFiltrados.length.toString()],
              ['Monto Total', `$${pagosFiltrados.reduce((sum, p) => sum + p.monto, 0).toLocaleString()}`]
            ],
            theme: 'grid',
            headStyles: { fillColor: [12, 71, 107], textColor: 255, fontStyle: 'bold' },
            margin: { left: 20, right: 20 }
          });
          finalY = doc.lastAutoTable.finalY + 10;
          
          // Datos de Accionistas con más información útil
          const accionistasData = accionistasFiltrados.map(a => {
            const pagosAcc = pagosFiltrados.filter(p => p.accionistaId === a.id);
            const totalAcc = pagosAcc.reduce((sum, p) => sum + p.monto, 0);
            const compAcc = pagosAcc.filter(p => p.estado === 'Completado').length;
            const pendAcc = pagosAcc.filter(p => p.estado === 'Pendiente').length;
            const saldoPend = pagosAcc.filter(p => p.estado === 'Pendiente').reduce((sum, p) => sum + p.monto, 0);
            const tasaCump = pagosAcc.length > 0 ? ((compAcc / pagosAcc.length) * 100).toFixed(0) : 0;
            return [
              a.nombre,
              a.codigo,
              a.estado,
              pagosAcc.length.toString(),
              `$${totalAcc.toLocaleString()}`,
              `${compAcc}/${pendAcc}`,
              `$${saldoPend.toLocaleString()}`,
              `${tasaCump}%`
            ];
          });
          
          autoTable(doc, {
            startY: finalY,
            head: [['Accionista', 'Código', 'Estado', 'Pagos', 'Monto', 'C/P', 'Saldo', 'Cumpl.']],
            body: accionistasData,
            theme: 'striped',
            headStyles: { fillColor: [12, 71, 107], textColor: 255, fontStyle: 'bold', fontSize: 8 },
            margin: { left: 20, right: 20 },
            styles: { fontSize: 7, cellPadding: 2 },
            columnStyles: {
              0: { cellWidth: 35 },
              1: { cellWidth: 20 },
              2: { cellWidth: 18 },
              3: { cellWidth: 15 },
              4: { cellWidth: 25 },
              5: { cellWidth: 15 },
              6: { cellWidth: 25 },
              7: { cellWidth: 17 }
            }
          });
          finalY = doc.lastAutoTable.finalY + 10;
          
          // Estadísticas con análisis de cumplimiento
          const completados = pagosFiltrados.filter(p => p.estado === 'Completado').length;
          const pendientes = pagosFiltrados.filter(p => p.estado === 'Pendiente').length;
          const tasaCumplimiento = pagosFiltrados.length > 0 ? ((completados/pagosFiltrados.length)*100).toFixed(1) : 0;
          const montoPendTotal = pagosFiltrados.filter(p => p.estado === 'Pendiente').reduce((sum, p) => sum + p.monto, 0);
          const montoCompTotal = pagosFiltrados.filter(p => p.estado === 'Completado').reduce((sum, p) => sum + p.monto, 0);
          
          autoTable(doc, {
            startY: finalY,
            head: [['Métrica', 'Valor', 'Detalle']],
            body: [
              ['Pagos Completados', completados.toString(), `$${montoCompTotal.toLocaleString()}`],
              ['Pagos Pendientes', pendientes.toString(), `$${montoPendTotal.toLocaleString()}`],
              ['Tasa de Cumplimiento', `${tasaCumplimiento}%`, `${completados} de ${pagosFiltrados.length}`],
              ['Accionistas con Deuda', accionistasFiltrados.filter(a => pagosFiltrados.filter(p => p.accionistaId === a.id && p.estado === 'Pendiente').length > 0).length.toString(), 'Requieren seguimiento']
            ],
            theme: 'grid',
            headStyles: { fillColor: [12, 71, 107], textColor: 255, fontStyle: 'bold' },
            margin: { left: 20, right: 20 }
          });
        } else if (tipo === 'pagos') {
          const completados = pagosFiltrados.filter(p => p.estado === 'Completado');
          const pendientes = pagosFiltrados.filter(p => p.estado === 'Pendiente');
          
          // Pagos Completados con más detalle
          const completadosData = completados.slice(0, 50).map(p => {
            const acc = accionistas.find(a => a.id === p.accionistaId);
            const diasProceso = p.fechaPago && p.fechaIngresoMulta ? 
              Math.floor((new Date(p.fechaPago) - new Date(p.fechaIngresoMulta)) / (1000 * 60 * 60 * 24)) : 0;
            return [
              p.id.toString(),
              acc?.nombre || 'N/A',
              p.fechaPago,
              `$${p.monto.toLocaleString()}`,
              p.metodo,
              `${diasProceso}d`
            ];
          });
          
          autoTable(doc, {
            startY: finalY,
            head: [['ID', 'Accionista', 'F. Pago', 'Monto', 'Método', 'Días']],
            body: completadosData,
            theme: 'striped',
            headStyles: { fillColor: [12, 71, 107], textColor: 255, fontStyle: 'bold', fontSize: 8 },
            margin: { left: 20, right: 20 },
            styles: { fontSize: 7, cellPadding: 2 },
            columnStyles: {
              0: { cellWidth: 15 },
              1: { cellWidth: 50 },
              2: { cellWidth: 25 },
              3: { cellWidth: 25 },
              4: { cellWidth: 30 },
              5: { cellWidth: 15 }
            },
            didDrawPage: (data) => {
              doc.setFontSize(10);
              doc.setFont(undefined, 'bold');
              doc.text(`Pagos Completados (${completados.length})`, 20, data.settings.startY - 5);
            }
          });
          finalY = doc.lastAutoTable.finalY + 10;
          
          // Pagos Pendientes con días de mora
          const pendientesData = pendientes.slice(0, 50).map(p => {
            const acc = accionistas.find(a => a.id === p.accionistaId);
            const diasMora = Math.floor((new Date() - new Date(p.fechaIngresoMulta)) / (1000 * 60 * 60 * 24));
            const prioridad = diasMora > 60 ? 'Alta' : diasMora > 30 ? 'Media' : 'Baja';
            return [
              p.id.toString(),
              acc?.nombre || 'N/A',
              p.fechaIngresoMulta,
              `$${p.monto.toLocaleString()}`,
              `${diasMora}d`,
              prioridad
            ];
          });
          
          if (pendientesData.length > 0) {
            autoTable(doc, {
              startY: finalY,
              head: [['ID', 'Accionista', 'F. Ingreso', 'Monto', 'Mora', 'Prioridad']],
              body: pendientesData,
              theme: 'striped',
              headStyles: { fillColor: [245, 158, 11], textColor: 255, fontStyle: 'bold', fontSize: 8 },
              margin: { left: 20, right: 20 },
              styles: { fontSize: 7, cellPadding: 2 },
              columnStyles: {
                0: { cellWidth: 15 },
                1: { cellWidth: 50 },
                2: { cellWidth: 25 },
                3: { cellWidth: 25 },
                4: { cellWidth: 20 },
                5: { cellWidth: 25 }
              },
              didDrawPage: (data) => {
                doc.setFontSize(10);
                doc.setFont(undefined, 'bold');
                doc.text(`Pagos Pendientes (${pendientes.length})`, 20, data.settings.startY - 5);
              }
            });
          }
        } else if (tipo === 'estadistico') {
          const completados = pagosFiltrados.filter(p => p.estado === 'Completado').length;
          const pendientes = pagosFiltrados.filter(p => p.estado === 'Pendiente').length;
          const totalMonto = pagosFiltrados.reduce((sum, p) => sum + p.monto, 0);
          const promedio = pagosFiltrados.length > 0 ? totalMonto / pagosFiltrados.length : 0;
          
          // Tendencias por año
          const porAnio = {};
          pagosFiltrados.forEach(p => {
            const anio = p.fechaIngresoMulta?.split('-')[0] || 'Sin fecha';
            if (!porAnio[anio]) porAnio[anio] = { total: 0, cantidad: 0 };
            porAnio[anio].total += p.monto;
            porAnio[anio].cantidad++;
          });
          
          // Tendencias con variación
          const tendenciasData = Object.entries(porAnio).sort().map(([anio, datos], idx, arr) => {
            const variacion = idx > 0 ? 
              ((datos.total - arr[idx-1][1].total) / arr[idx-1][1].total * 100).toFixed(1) : '0.0';
            return [
              anio,
              datos.cantidad.toString(),
              `$${datos.total.toLocaleString()}`,
              `$${Math.round(datos.total / datos.cantidad).toLocaleString()}`,
              `${variacion}%`
            ];
          });
          
          autoTable(doc, {
            startY: finalY,
            head: [['Año', 'Cantidad', 'Total', 'Promedio', 'Variación']],
            body: tendenciasData,
            theme: 'grid',
            headStyles: { fillColor: [12, 71, 107], textColor: 255, fontStyle: 'bold' },
            margin: { left: 20, right: 20 }
          });
          finalY = doc.lastAutoTable.finalY + 10;
          
          // Distribución con análisis
          const montoRecaudado = pagosFiltrados.filter(p => p.estado === 'Completado').reduce((sum, p) => sum + p.monto, 0);
          const montoPorRecaudar = pagosFiltrados.filter(p => p.estado === 'Pendiente').reduce((sum, p) => sum + p.monto, 0);
          const eficienciaRecaudacion = totalMonto > 0 ? ((montoRecaudado / totalMonto) * 100).toFixed(1) : 0;
          
          autoTable(doc, {
            startY: finalY,
            head: [['Métrica', 'Valor', 'Análisis']],
            body: [
              ['Total Pagos', pagosFiltrados.length.toString(), `${completados} completados, ${pendientes} pendientes`],
              ['Monto Recaudado', `$${montoRecaudado.toLocaleString()}`, `${eficienciaRecaudacion}% del total`],
              ['Monto Por Recaudar', `$${montoPorRecaudar.toLocaleString()}`, `${pendientes} pagos pendientes`],
              ['Promedio por Pago', `$${Math.round(promedio).toLocaleString()}`, 'Basado en todos los pagos'],
              ['Tasa de Cumplimiento', `${((completados/pagosFiltrados.length)*100).toFixed(1)}%`, completados >= pendientes ? 'Buena' : 'Requiere atención']
            ],
            theme: 'striped',
            headStyles: { fillColor: [12, 71, 107], textColor: 255, fontStyle: 'bold' },
            margin: { left: 20, right: 20 }
          });
        } else if (tipo === 'accionistas') {
          const accionistasData = accionistas.map(a => {
            const pagosAcc = pagosFiltrados.filter(p => p.accionistaId === a.id);
            const totalAcc = pagosAcc.reduce((sum, p) => sum + p.monto, 0);
            const compAcc = pagosAcc.filter(p => p.estado === 'Completado').length;
            const pendAcc = pagosAcc.filter(p => p.estado === 'Pendiente').length;
            const saldoPend = pagosAcc.filter(p => p.estado === 'Pendiente').reduce((sum, p) => sum + p.monto, 0);
            const tasaCump = pagosAcc.length > 0 ? ((compAcc / pagosAcc.length) * 100).toFixed(0) : 0;
            return [
              a.id.toString(),
              a.nombre,
              a.codigo,
              a.estado,
              pagosAcc.length.toString(),
              `$${totalAcc.toLocaleString()}`,
              `$${saldoPend.toLocaleString()}`,
              `${tasaCump}%`
            ];
          });
          
          autoTable(doc, {
            startY: finalY,
            head: [['ID', 'Nombre', 'Código', 'Estado', 'Pagos', 'Total', 'Saldo', 'Cumpl.']],
            body: accionistasData,
            theme: 'striped',
            headStyles: { fillColor: [12, 71, 107], textColor: 255, fontStyle: 'bold', fontSize: 8 },
            margin: { left: 20, right: 20 },
            styles: { fontSize: 7, cellPadding: 2, overflow: 'linebreak' },
            columnStyles: {
              0: { cellWidth: 10 },
              1: { cellWidth: 40 },
              2: { cellWidth: 20 },
              3: { cellWidth: 18 },
              4: { cellWidth: 15 },
              5: { cellWidth: 25 },
              6: { cellWidth: 25 },
              7: { cellWidth: 17 }
            }
          });
        }
        
        // Pie de página en todas las páginas
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(128, 128, 128);
          doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
          doc.text('Banco ANEUPI - Sistema de Gestión de Multas', pageWidth / 2, pageHeight - 5, { align: 'center' });
        }
        
        doc.save(`${nombreArchivo}.pdf`);
      } else {
        let extension = formato;
        let mimeType = 'text/plain';
        
        if (formato === 'excel') {
          extension = 'xls';
          mimeType = 'application/vnd.ms-excel';
        } else if (formato === 'csv') {
          mimeType = 'text/csv';
        }

        const blob = new Blob([contenido], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${nombreArchivo}.${extension}`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
      
      setReporteGenerando(false);
      setTipoReporteSeleccionado(null);
    }, 2000);
  };
  
  const obtenerDatosPreview = () => {
    const pagosFiltrados = pagos.filter(p => {
      if (filtros.anio !== "Todos" && !p.fechaIngresoMulta?.includes(filtros.anio)) return false;
      if (filtros.estado !== "Todos" && p.estado !== filtros.estado) return false;
      return true;
    });
    
    return {
      totalRegistros: pagosFiltrados.length,
      totalMonto: pagosFiltrados.reduce((sum, p) => sum + p.monto, 0),
      completados: pagosFiltrados.filter(p => p.estado === "Completado").length,
      pendientes: pagosFiltrados.filter(p => p.estado === "Pendiente").length
    };
  };

  const preview = obtenerDatosPreview();
  
  const tiposReporte = [
    {
      id: "completo",
      nombre: "Reporte Completo",
      descripcion: "Documento integral con toda la información del sistema",
      contenido: ["Resumen ejecutivo", "Análisis de accionistas", "Métricas de cumplimiento"],
      icono: <FaFileExport className="text-3xl" />
    },
    {
      id: "pagos",
      nombre: "Reporte de Pagos",
      descripcion: "Detalle completo de todas los pagos realizados",
      contenido: ["Pagos completados con días de proceso", "Pagos pendientes con prioridad"],
      icono: <FaMoneyCheckAlt className="text-3xl" />
    },
    {
      id: "estadistico",
      nombre: "Reporte Estadístico",
      descripcion: "Análisis detallado con métricas y tendencias",
      contenido: ["Tendencias con variación anual", "Análisis de eficiencia"],
      icono: <FaChartBar className="text-3xl" />
    },
    {
      id: "accionistas",
      nombre: "Reporte de Accionistas",
      descripcion: "Información completa de todos los accionistas registrados",
      contenido: ["Datos personales", "Estado de cuenta con saldos"],
      icono: <FaUser className="text-3xl" />
    }
  ];
  
  return (
    <div className="p-7">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-aneupi-primary mb-3">Generador de Reportes</h2>
        <p className="text-aneupi-text-secondary text-lg">Sistema de exportación de información - Banco ANEUPI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-aneupi-primary/20 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-aneupi-primary">Configuración de Exportación</h3>
              <button onClick={() => setShowFilters(!showFilters)} className="px-4 py-2 bg-aneupi-primary text-white rounded-lg hover:bg-aneupi-primary-dark transition-colors flex items-center gap-2">
                <FaFilter /> {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
              </button>
            </div>
            
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-aneupi-bg-tertiary rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-aneupi-primary mb-2">Año</label>
                  <select value={filtros.anio} onChange={(e) => setFiltros({...filtros, anio: e.target.value})} className="w-full px-4 py-2 border-2 border-aneupi-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-aneupi-primary">
                    <option value="Todos">Todos los años</option>
                    {anios.map(anio => <option key={anio} value={anio}>{anio}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-aneupi-primary mb-2">Estado</label>
                  <select value={filtros.estado} onChange={(e) => setFiltros({...filtros, estado: e.target.value})} className="w-full px-4 py-2 border-2 border-aneupi-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-aneupi-primary">
                    <option value="Todos">Todos</option>
                    <option value="Completado">Completado</option>
                    <option value="Pendiente">Pendiente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-aneupi-primary mb-2">Formato</label>
                  <select value={filtros.formato} onChange={(e) => setFiltros({...filtros, formato: e.target.value})} className="w-full px-4 py-2 border-2 border-aneupi-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-aneupi-primary">
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel</option>
                    <option value="csv">CSV</option>
                  </select>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tiposReporte.map(reporte => (
                <div key={reporte.id} className="bg-aneupi-bg-tertiary rounded-lg p-5 border-2 border-aneupi-primary/20 hover:border-aneupi-primary transition-all hover:shadow-md">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-white rounded-lg text-aneupi-primary border-2 border-aneupi-primary/20">
                      {reporte.icono}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-aneupi-primary text-lg mb-1">{reporte.nombre}</h4>
                      <p className="text-sm text-aneupi-text-secondary">{reporte.descripcion}</p>
                    </div>
                  </div>
                  
                  <ul className="space-y-2 mb-4">
                    {reporte.contenido.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-aneupi-text-secondary">
                        <FaCheckCircle className="text-aneupi-primary text-xs" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={() => generarReporte(reporte.id)}
                    disabled={reporteGenerando}
                    className={`w-full px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                      reporteGenerando && tipoReporteSeleccionado === reporte.id
                        ? 'bg-aneupi-primary text-white opacity-80'
                        : reporteGenerando
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-aneupi-primary text-white hover:bg-aneupi-primary-dark shadow-sm hover:shadow'
                    }`}
                  >
                    {reporteGenerando && tipoReporteSeleccionado === reporte.id ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Generando...
                      </>
                    ) : (
                      <>
                        <FaDownload />
                        Generar Reporte
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-aneupi-primary/20 mb-6 sticky top-4">
            <h3 className="text-xl font-bold text-aneupi-primary mb-4 flex items-center gap-2">
              <FaEye /> Vista Previa
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-aneupi-bg-tertiary rounded-lg border border-aneupi-primary/20">
                <p className="text-sm text-aneupi-text-muted mb-1">Total Registros</p>
                <p className="text-2xl font-bold text-aneupi-primary">{preview.totalRegistros}</p>
              </div>
              <div className="p-4 bg-aneupi-bg-tertiary rounded-lg border border-aneupi-primary/20">
                <p className="text-sm text-aneupi-text-muted mb-1">Monto Total</p>
                <p className="text-2xl font-bold text-aneupi-primary">${preview.totalMonto.toLocaleString()}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-aneupi-bg-tertiary rounded-lg border border-aneupi-primary/20">
                  <p className="text-xs text-aneupi-text-muted mb-1">Completados</p>
                  <p className="text-xl font-bold text-aneupi-primary">{preview.completados}</p>
                </div>
                <div className="p-3 bg-aneupi-bg-tertiary rounded-lg border border-aneupi-primary/20">
                  <p className="text-xs text-aneupi-text-muted mb-1">Pendientes</p>
                  <p className="text-xl font-bold text-aneupi-primary">{preview.pendientes}</p>
                </div>
              </div>
              <div className="p-4 bg-aneupi-bg-tertiary rounded-lg border border-aneupi-primary/20">
                <p className="text-sm text-aneupi-text-muted mb-2">Formato de Exportación</p>
                <div className="flex items-center gap-2 text-aneupi-primary">
                  {filtros.formato === 'pdf' && <FaFilePdf className="text-2xl" />}
                  {filtros.formato === 'excel' && <FaFileExcel className="text-2xl" />}
                  {filtros.formato === 'csv' && <FaFileCsv className="text-2xl" />}
                  <span className="font-bold text-lg">{filtros.formato.toUpperCase()}</span>
                </div>
              </div>
              <div className="p-4 bg-aneupi-bg-tertiary rounded-lg border border-aneupi-primary/20">
                <p className="text-sm text-aneupi-text-muted mb-1">Accionistas</p>
                <p className="text-xl font-bold text-aneupi-primary flex items-center gap-2">
                  <FaDatabase /> {totalAccionistas}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-aneupi-primary/20">
        <h3 className="text-xl font-bold text-aneupi-primary mb-4">Información de Reportes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-l-4 border-aneupi-primary pl-4">
            <h4 className="font-medium text-aneupi-primary mb-2">Formatos Disponibles</h4>
            <ul className="space-y-2 text-sm text-aneupi-text-secondary">
              <li className="flex items-center gap-2"><FaFilePdf className="text-aneupi-primary" /> PDF - Ideal para documentos oficiales y presentaciones</li>
              <li className="flex items-center gap-2"><FaFileExcel className="text-aneupi-primary" /> Excel - Perfecto para análisis y manipulación de datos</li>
              <li className="flex items-center gap-2"><FaFileCsv className="text-aneupi-primary" /> CSV - Compatible con múltiples sistemas y aplicaciones</li>
            </ul>
          </div>
          <div className="border-l-4 border-aneupi-primary pl-4">
            <h4 className="font-medium text-aneupi-primary mb-2">Características</h4>
            <ul className="space-y-2 text-sm text-aneupi-text-secondary">
              <li className="flex items-center gap-2"><FaCheckCircle className="text-aneupi-primary" /> Filtrado por año y estado de pago</li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-aneupi-primary" /> Vista previa de datos en tiempo real</li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-aneupi-primary" /> Descarga automática al generar</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportesTab;
