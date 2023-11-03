<template>
  <div class="q-pa-md">
    <div class="agre">
      <q-btn label="Agregar" color="blue" @click="modal = true" />
    </div>

    <q-dialog v-model="modal">
      <q-card>
        <q-card-section>
          <div class="text-h6">DATOS</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">
          <div class="infoDatos">
            <q-select color="teal" class="inputDatos" filled v-model="model" :options="opcionesRutas" label="Rutas">
              <template v-slot:prepend>
                <img src="https://cdn-icons-png.flaticon.com/128/3419/3419596.png" style="height: 20px; width: 20px" />
              </template>
            </q-select>
            <br>
            <q-select color="teal" class="inputDatos" filled v-model="model2" :options="opcionesBuses" label="Buses">
              <template v-slot:prepend>
                <img src="https://cdn-icons-png.flaticon.com/128/3419/3419596.png" style="height: 20px; width: 20px" />
              </template>
            </q-select>
            <br>
            <q-select color="teal" class="inputDatos" filled v-model="model3" label="Fecha de salida">
              <template v-slot:prepend>
                <img src="https://cdn-icons-png.flaticon.com/128/10692/10692920.png" style="height: 20px; width: 20px" />
              </template>
            </q-select>
        
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="center">
          <q-btn flat label="Cerrar"  color="primary"  v-close-popup />
          <q-btn flat label="Aceptar" color="primary"  v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="cargar_contenedor" v-if="dataLoaded">
      <q-table title="DATOS TICKETS" :rows="rows" :columns="columns" row-key="fecha_venta" class="tableRT">
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useboletoStore } from "../stores/boleto.js";
import { useRutaStore } from "../stores/ruta.js";
import { useBusStore } from '../stores/bus.js';


const busStore = useBusStore()
const rutaStore = useRutaStore()
const boletoStore = useboletoStore();

const model = ref(null);  
const model2 = ref(null);
const model3 = ref(null);    

const modal = ref(false);
const rows = ref([]);
const dataLoaded = ref(false);

const columns = [
  { name: "fecha_venta", required: true, label: "Fecha_Venta", align: "left", field: (row) => row.fechas[0].fecha_salida, sortable: true },
  { name: "hora_venta", required: true, label: "Hora_Venta", align: "left", field: (row) => row.fechas[0].hora_venta, sortable: true },
  { name: "fecha_salida", required: true, label: "Fecha_Salida", align: "left", field: (row) => row.fechas[0].fecha_salida, sortable: true },
  { name: "hora_salida", required: true, label: "Hora_salida", align: "left", field: (row) => row.fechas[0].hora_salida, sortable: true },
  { name: "Precio", required: true, label: "Precio", align: "left", field: "Precio", sortable: true },
  { name: "acciones", required: true, label: "Acciones", align: "center", field: "acciones" },
];

async function obtenerBoleto() {
  try {
    const response = await boletoStore.obtener();
    dataLoaded.value = true;
    console.log(response);
    if (response && response.boletoPopulate) {
      rows.value = response.boletoPopulate;
    }
  } catch (error) {
    console.error('Error al obtener los boletos:', error);
  }
}

const opcionesRutas = ref([]);
const opcionesBuses = ref([]);


async function obtenerBus() {
  try {
    const response = await busStore.obtener();

    if (Array.isArray(response.buses)) {
      const empresasAsignadas = response.buses.map(bus => `${bus.empresa_asignada} / ${bus.n_asiento}`);
      opcionesBuses.value = empresasAsignadas;
      rows.value = empresasAsignadas;
    } else {
      console.error('Los datos de los buses no son un array válido:', response.buses);
    }
  } catch (error) {
    console.error('Error al obtener los buses:', error);
  }
}


async function obtenerRuta() {
  try {
    const responseRuta = await rutaStore.obtener();
    if (Array.isArray(responseRuta)) {
      const origenRutaDestino = responseRuta.map(ruta => `${ruta.origen} - ${ruta.destino} / ${ruta.horarios}`);
      opcionesRutas.value = origenRutaDestino;
      rows.value = origenRutaDestino;
    } else {
      console.error('Los datos de los ruta no son un array válido:', responseRuta);
    }
  } catch (error) {
    console.error('Error al obtener los ruta:', error);
  }
}

onMounted(() => {
  obtenerBoleto();
  obtenerRuta();
  obtenerBus(); 
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

.scroll {
  width: 100%;
}


.infoDatos {
  display: flex;
  margin: 0 auto;
  flex-direction: column;
}


.inputDatos {
  width: 300px;
  padding: 5px;
}



label {
  margin-right: 20px;
}

h3 {
  font-weight: bold;
}
</style>
      
    