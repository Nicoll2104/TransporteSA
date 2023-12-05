<template>
  <div class="q-pa-md">
    <div class="cargando">
      <q-spinner-ios v-if="loading" color="primary" size="100px" />
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
            <q-btn class="btnEditar" icon="edit" color="primary" @click="editarBoleto(props.row)"></q-btn>
            <q-btn class="btnActivar" v-if="props.row.status == 1" @click="desactivar(props.row._id)">❌</q-btn>
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
  { name: "fecha_venta", required: true, label: "Fecha_Venta", align: "center", field: (row) => convertirFecha(row.fechas[0].fecha_venta), sortable: true },
  { name: "hora_venta", required: true, label: "Hora_Venta", align: "center", field: (row) => (row.fechas[0].hora_venta), sortable: true },
  { name: "fecha_salida", required: true, label: "Fecha_Salida", align: "center", field: (row) => convertirFecha(row.fechas[0].fecha_salida), sortable: true },
  { 
  name: "ruta",
  required: true,
  label: "Hora_Salida",
  align: "center",
  field: (row) => convertirHora(row.ruta.horarios),
  sortable: true 
},
  { name: "cliente", required: true, label: "Cedula cliente", align: "center", field: (row) => row.cliente.cedula, sortable: true },
  { name: "cliente", required: true, label: "Nombre Cliente", align: "center", field: (row) => row.cliente.nombre, sortable: true },
  { name: "conductor", required: true, label: "Conductor", align: "center", field: (row) => row.bus.conductor.nombre, sortable: true },
  { name: "numero", required: true, label: "Numero de bus", align: "center", field: (row) => row.bus.numero, sortable: true },
  { name: "ruta", required: true, label: "Origen", align: "center", field: (row) => row.ruta.origen, sortable: true },
  { name: "ruta", required: true, label: "Destino", align: "center", field: (row) => row.ruta.destino, sortable: true },
  { name: "Número de asientos", required: true, label: "Número de asientos", align: "center", field: (row) => row.asientos, sortable: true },
  { name: "Precio", required: true, label: "Precio", align: "center", field: "Precio", sortable: true },
  { name: "acciones", required: true, label: "Acciones", align: "center", field: "acciones", },
];

function convertirFecha(cadenaFecha) {
  const fecha = new Date(cadenaFecha);
  const año = fecha.getFullYear();
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
  const dia = fecha.getDate().toString().padStart(2, "0");

  const fechaFormateada = `${año}/${mes}/${dia}`;
  return fechaFormateada;
}

function convertirHora(cadenaFecha) {
  const fecha = new Date(cadenaFecha);
  let horas = fecha.getHours();
  const amPM = horas >= 12 ? 'PM' : 'AM';
  horas = horas % 12 || 12;
  const minutos = fecha.getMinutes().toString().padStart(2, '0');

  const horaFormateada = `${horas}:${minutos} ${amPM}`;
  return horaFormateada;
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
    format: [85, 120] 
  });

  doc.setLineWidth(0.5); 
  doc.setFontSize(12); 

  doc.text(`Boleto de Autobús`, doc.internal.pageSize.getWidth() / 2, 5, { align: 'center' });
  const ticketInfo = [
    { label: "Cedula de vendedor", value: registro.vendedor.cedula },
    { label: "Nombre de vendedor", value: registro.vendedor.nombre },
    { label: "Fecha de Venta", value: convertirFecha(registro.fechas[0].fecha_salida) },
    { label: "Hora de Venta", value: registro.fechas[0].hora_venta },
    { label: "Fecha de Salida", value: convertirFecha(registro.fechas[0].fecha_salida) },
    { label: "Hora de Salida", value: registro.ruta.horarios },
    { type: "line" },
    { label: "Cedula de cliente", value: registro.cliente.cedula },
    { label: "Nombre de Cliente", value: registro.cliente.nombre },
    { label: "Nombre de conductor", value: registro.bus.conductor.nombre },
    { label: "Numero de bus", value: registro.bus.numero },
    { label: "Origen", value: registro.ruta.origen },
    { label: "Destino", value: registro.ruta.destino },
    { label: "Número de asiento", value: registro.asientos },
    { label: "Precio", value: registro.Precio },
  ];

  let y = 15; 

  ticketInfo.forEach(info => {
    if (info.type === "line") {
      doc.line(5, y + 2, 75, y + 2); 
    } else {
      doc.text(`${info.label}: ${info.value}`, 5, y);
    }
    
    y += (info.type === "line") ? 12 : 6; 
  });

  doc.save(`Boleto_${registro._id}.pdf`);
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

.icono {
  color: white;
}


.infoDatos {
  display: flex;
  margin: 0 auto;
  flex-direction: column;
}

.ilDatos {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
}


.labelDatos {
  display: flex;
  align-items: center;
  width: 60px;

}

.inputDatos {
  width: 200px;
  padding: 5px;
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