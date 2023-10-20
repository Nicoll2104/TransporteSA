<template>
  <div class="q-pa-md">
    <q-table title="DATOS RUTAS" :rows="rows" :columns="columns" row-key="origen" class="tableRT" >
      <template v-slot:body-cell-status="props">
        <q-td key="status" :props="props">
          <span class="color1" v-if="props.row.status == 1">Activo</span>
          <span class="color2" v-else>Inactivo</span>
        </q-td>
      </template>
      <template v-slot:body-cell-acciones="props">
        <q-td key="acciones" :props="props">
          <q-btn class="btnEditar" icon="edit" color="amber" @click="editarCliente(props.row)"></q-btn>
          <q-btn class="btnActivar" v-if="props.row.status == 1" @click="desactivar(props.row._id)">❌</q-btn>
          <q-btn class="btnActivar" v-else @click="activar(props.row._id)">✅</q-btn>
        </q-td>
      </template>
      
    </q-table>
    <q-dialog v-model="modal">
      <q-card>
        <q-card-section>
          <div class="text-h6">DATOS DE RUTAS</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">
          <div class="infoDatos">
            <div class="ilDatos">
              <label class="labelDatos" for="origen">Origen:</label>
              <input class="inputDatos" type="text" id="origen" v-model="origen" />
            </div>

            <div class="ilDatos">
              <label class="labelDatos" for="destino">Destino:</label>
              <input class="inputDatos" type="text" id="destino" v-model="destino" />
            </div>

            <div class="ilDatos">
              <label class="labelDatos" for="horarios"> Horario:</label>
              <input class="inputDatos" type="text" id="horarios" v-model="horarios" />
            </div>

            <div class="ilDatos">
              <label class="labelDatos" for="distancia">Distancia:</label>
              <input class="inputDatos" type="text" id="distancia" v-model="distancia" />
            </div>

            <div class="ilDatos">
              <label class="labelDatos" for="duracion">Duracion:</label>
              <input class="inputDatos" type="text" id="duracion" v-model="duracion" />
            </div>

            <div class="ilDatos">
              <label class="labelDatos" for="fecha">Fecha:</label>
              <input class="inputDatos" type="date" id="fecha" v-model="fecha" />
            </div>

          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
          <q-btn flat label="Aceptar" color="primary" @click="AgregarRuta" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-btn label="Agregar" color="primary" @click="modal = true" />

  </div>
</template>
  
<script setup>
import { onMounted,ref } from "vue";
import { useRutaStore } from "../stores/ruta.js";

const rutaStore = useRutaStore()

const modal = ref(false)
const rows = ref([]);
const origen = ref("");
const destino = ref("");
const horarios = ref("");
const distancia = ref("");
const duracion = ref("");
const fecha = ref("");

async function obtenerRuta() {
  try {
    const rutas = await rutaStore.obtener();
    console.log('rutas obtenidas:', rutas); 
    rows.value = rutaStore.datosData;
  } catch (error) {
    console.error('Error al obtener las rutas:', error);
  }
}

async function AgregarRuta() {
  const nuevoRuta = {
    origen: origen.value,
    destino: destino.value,
    horarios: horarios.value,
    distancia: distancia.value,
    duracion: duracion.value,
    fecha: fecha.value,
  };
  console.log("ruta agregada:", nuevoRuta);

  try {
    await rutaStore.agregarRuta(nuevoRuta);

    origen.value = "";
    destino.value = "";
    horarios.value = "";
    distancia.value = "";
    duracion.value = "";
    fecha.value = "";

    modal.value = false;

    obtenerRuta();
  } catch (error) {
    console.error('Error al agregar un ruta:', error);
  }
}

async function activar(id) {
  try {
    const ruta = await rutaStore.activarRuta(id);
    console.log('ruta activada:', ruta);
    obtenerRuta();
  } catch (error) {
    console.error('Error al activar ruta:', error);
  }
}

async function desactivar(id) {
  try {
    const ruta = await rutaStore.desactivarRuta(id);
    console.log('ruta desactivada:', ruta);
    obtenerRuta();
  } catch (error) {
    console.error('Error al desactivar ruta:', error);
  }
}




onMounted(() => {
  obtenerRuta()
});


const columns = [
  { name: "origen", required: true, label: "Origen", align: "left", field: "origen", sortable: true },
  { name: "destino", required: true, label: "Destino", align: "left", field: "destino", sortable: true },
  { name: "horarios", required: true, label: "Horario", align: "left", field: "horarios", sortable: true },
  { name: "distancia", required: true, label: "Distancia", align: "left", field: "distancia", sortable: true },
  { name: "duracion", required: true, label: "Duracion", align: "left", field: "duracion", sortable: true },
  { name: "fecha", required: true, label: "Fecha", align: "left", field: "fecha", sortable: true },
  { name: "status", label: "Status", align: "left", field: "status", sortable: true },
  { name: "acciones", required: true, label: "Acciones", align: "center", field: "acciones", },
];

</script>
    
<style scoped>
.color1 {
  color: rgb(136, 226, 0);
}

.color2 {
  color: red;
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
</style>
    
  