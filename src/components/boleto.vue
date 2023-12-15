<template>
  <div class="q-pa-md">
    <div class="cargando">
      <q-spinner-hourglass v-if="loading" color="blue" size="100px" />
      <p class="p-carga">Cargando...</p>
    </div>

    <div class="cargar_contenedor" v-if="dataLoaded">
      <q-table title="DATOS TICKETS" :rows="rows" :columns="columns" row-key="fecha_venta" class="tableRT">
        <template v-slot:body-cell-status="props">
          <q-td key="status" :props="props">
            <span class="color1" v-if="props.row.status == 1">Activo</span>
            <span class="color2" v-else>Inactivo</span>
          </q-td>
        </template>
        <template v-slot:body-cell-acciones="props">
          <q-td key="acciones" :props="props">
            <q-btn class="btnEditar" color="white" text-color="black" label="📄" @click="generarPDF(props.row)" />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>
    
<script setup>
import { onMounted, ref } from "vue";
import { useboletoStore } from "../stores/boleto.js";
import { jsPDF } from "jspdf";


const boletoStore = useboletoStore()


const rows = ref([]);
const loading = ref(false);
const dataLoaded = ref(false);

const columns = [
  { name: "vendedor", required: true, label: "Cedula vendedor", align: "center", field: (row) => row.vendedor.cedula, sortable: true },
  { name: "vendedor", required: true, label: "Nombre vendedor", align: "center", field: (row) => row.vendedor.nombre, sortable: true },
  { name: "fecha_venta", required: true, label: "Fecha de Venta", align: "center", field: (row) => convertirFecha(row.fecha_venta), sortable: true },
  { name: "hora_venta", required: true, label: "Hora de Venta", align: "center", field: (row) => (row.hora_venta), sortable: true },
  { name: "fecha_salida", required: true, label: "Fecha de Salida", align: "center", field: (row) => convertirFecha(row.fecha_salida), sortable: true },
  { name: "hora_salida", required: true, label: "Hora de Salida", align: "center", field: (row) => convertirHora(row.ruta.horarios), sortable: true },
  { name: "cliente", required: true, label: "Cedula de cliente", align: "center", field: (row) => row.cliente.cedula, sortable: true },
  { name: "cliente", required: true, label: "Nombre de Cliente", align: "center", field: (row) => row.cliente.nombre, sortable: true },
  { name: "conductor", required: true, label: "Conductor", align: "center", field: (row) => row.bus.conductor.nombre, sortable: true },
  { name: "numero", required: true, label: "Numero de bus", align: "center", field: (row) => row.bus.numero, sortable: true },
  { name: "ruta", required: true, label: "Origen", align: "center", field: (row) => row.ruta.origen, sortable: true },
  { name: "ruta", required: true, label: "Destino", align: "center", field: (row) => row.ruta.destino, sortable: true },
  { name: "Número de asientos", required: true, label: "Número de asientos", align: "center", field: (row) => row.asientos, sortable: true },
  { name: "Precio", required: true, label: "Precio", align: "center", field: "Precio",format:(val) => formatoMonedaLocal(val) ,sortable: true },
  { name: "acciones", required: true, label: "Acciones", align: "center", field: "acciones", },
];

function convertirFecha(cadenaFecha) {
  const fecha = new Date(cadenaFecha);
  const offset = 5 * 60;
  fecha.setMinutes(fecha.getMinutes() + offset);
  const año = fecha.getFullYear();
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
  const dia = fecha.getDate().toString().padStart(2, "0");

  const fechaFormateada = `${dia}/${mes}/${año}`;
  return fechaFormateada;
}


function convertirHora(cadenaHora) {
  const [horasStr, minutosStr] = cadenaHora.split(':');
  let horas = parseInt(horasStr, 10);
  const minutos = parseInt(minutosStr, 10);

  const sufijo = horas >= 12 ? 'PM' : 'AM';
  if (horas > 12) {
    horas -= 12;
  } else if (horas === 0) {
    horas = 12;
  }

  return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')} ${sufijo}`;
}


const obtenerBoleto = async () => {
  loading.value = true;
  try {
    const response = await boletoStore.obtener();
    dataLoaded.value = true;
    console.log(response);
    if (response && response.boletoPopulate) {
      rows.value = response.boletoPopulate.reverse();
    }
  } catch (error) {
    console.error('Error al obtener los boletos:', error);
  } finally {
    loading.value = false;
  }
};

const generarPDF = (registro) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [195, 115]
  });

  doc.setLineWidth(0.5);
  doc.setFontSize(12);


  const header = 'Boleto de Autobús';
  const maxWidth = doc.internal.pageSize.getWidth();
  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  const headerWidth = doc.getStringUnitWidth(header) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  const headerX = (maxWidth - headerWidth) / 2;
  doc.text(header, headerX, 10);


  const ticketInfo = [
    { label: "Cédula de vendedor", value: registro.vendedor.cedula },
    { label: "Nombre de vendedor", value: registro.vendedor.nombre },
    { label: "Fecha de Venta", value: convertirFecha(registro.fecha_salida) },
    { label: "Hora de Venta", value: registro.hora_venta },
    { label: "Fecha de Salida", value: convertirFecha(registro.fecha_salida) },
    { label: "Hora de Salida", value: convertirHora(registro.ruta.horarios) },
    { label: "Cédula de cliente", value: registro.cliente.cedula },
    { label: "Nombre de Cliente", value: registro.cliente.nombre },
    { label: "Nombre de conductor", value: registro.bus.conductor.nombre },
    { label: "Número de bus", value: registro.bus.numero },
    { label: "Origen", value: registro.ruta.origen },
    { label: "Destino", value: registro.ruta.destino },
    { label: "Número de asiento", value: registro.asientos },
    { label: "Precio", value: formatoMonedaLocal(registro.Precio) },
  ];

  let y = 30;


  const drawBorderedRect = (x, y, width, height) => {
    doc.setLineWidth(0.2);
    doc.rect(x, y, width, height);
  };

  ticketInfo.forEach(info => {
    doc.setFont('times', 'normal');
    doc.setFontSize(12);

    if (info.label === "Hora de Salida" || info.label === "Hora de Venta") {
      doc.setFont('times', 'italic');
      doc.text(`${info.label}: ${info.value}`, 5, y);
      doc.setFont('times');
    } else {
      doc.text(`${info.label}: ${info.value}`, 5, y);
    }

    y += 10;
  });

  doc.save(`Boleto_${registro._id}.pdf`);
};

const formatoMonedaLocal = (numero) => {
  return numero.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

onMounted(() => {
  obtenerBoleto();
});
</script>
      
<style scoped>
.color1 {
  color: rgb(136, 226, 0);
}

.color2 {
  color: red;
}

.cargando {
  display: grid;
  position: relative;
  top: 200px;
  align-items: center;
  justify-content: center;
}

.p-carga {
  position: relative;
  font-size: 20px;
  font-weight: 600;
}


.btnEditar {
  margin: 5px;
}

label {
  margin-right: 20px;
}

h3 {
  font-weight: bold;
}
</style>