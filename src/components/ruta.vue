<template>
  <div class="q-pa-md">

    <div class="title"><h3>Datos Rutas</h3>

<div class="raya"></div>
</div><br><br>

<div class="agre"><q-btn label="Agregar" color="blue" @click="modal = true" /></div><br><br>

    <q-table title="DATOS RUTAS" :rows="rows" :columns="columns" row-key="origen" class="tableRT">
      <template v-slot:body-cell-status="props">
        <q-td key="status" :props="props">
          <span class="color1" v-if="props.row.status == 1">Activo</span>
          <span class="color2" v-else>Inactivo</span>
        </q-td>
      </template>
      <template v-slot:body-cell-acciones="props">
        <q-td key="acciones" :props="props">
          <q-btn class="btnEditar" icon="edit" color="blue" @click="editarRuta(props.row)"></q-btn>
          <q-btn class="btnActivar" v-if="props.row.status == 1" @click="desactivar(props.row._id)">❌</q-btn>
          <q-btn class="btnActivar" v-else @click="activar(props.row._id)">✅</q-btn>
        </q-td>
      </template>

    </q-table>
    <q-dialog v-model="modal">
      <q-card>

        <q-card-section class="arri">
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

          <q-btn flat label="Cerrar" 
          color="white" @click="limpiar" 
          class="btnc"
          v-close-popup />

          <q-btn flat label="Aceptar" 
          color="white" 
          class="btna"
          @click="agregarEditarRuta"  :loading="cargando" />

        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
  
<script setup>
import { onMounted, ref } from "vue";
import { useRutaStore } from "../stores/ruta.js";
import { useQuasar } from 'quasar'

const rutaStore = useRutaStore()

const modal = ref(false)
const rows = ref([]);
const origen = ref("");
const destino = ref("");
const horarios = ref("");
const distancia = ref("");
const duracion = ref("");
const fecha = ref("");
const rutaEditando = ref(null);
const $q = useQuasar()

const cargando = ref(false);
const modalAbierto = ref(false);

const columns = [
  { name: "origen", required: true, label: "Origen", align: "center", field: "origen", sortable: true },
  { name: "destino", required: true, label: "Destino", align: "center", field: "destino", sortable: true },
  { name: "horarios", required: true, label: "Horario", align: "center", field: "horarios", sortable: true },
  { name: "distancia", required: true, label: "Distancia", align: "center", field: "distancia", sortable: true },
  { name: "duracion", required: true, label: "Duracion", align: "center", field: "duracion", sortable: true },
  { name: "fecha", required: true, label: "Fecha", align: "center", field: "fecha", sortable: true },
  { name: "status", label: "Status", align: "center", field: "status", sortable: true },
  { name: "acciones", required: true, label: "Acciones", align: "center", field: "acciones", },
];

async function obtenerRuta() {
  try {
    const rutas = await rutaStore.obtener();
    console.log('rutas obtenidas:', rutas);
    rows.value = rutaStore.datosData;
  } catch (error) {
    console.error('Error al obtener las rutas:', error);
  }
}

const agregarEditarRuta = async () => {
  cargando.value = true;
  modalAbierto.value = true;

  if (rutaEditando.value) {
    const rutaEditado = {
      _id: rutaEditando.value._id,
      origen: origen.value,
      destino: destino.value,
      horarios: horarios.value,
      distancia: distancia.value,
      duracion: duracion.value,
      fecha: fecha.value.split('T')[0],
    };
    try {
      await rutaStore.editarRuta(rutaEditado);
      origen.value = "";
      destino.value = "";
      horarios.value = "";
      distancia.value = "";
      duracion.value = "";
      fecha.value = "";
      modal.value = false;
      rutaEditando.value = null;
      $q.notify({
        message: 'Ruta editado correctamente',
        textColor: 'white',
        type: "positive",
        color: 'green',
      });
      obtenerRuta();
    } catch (error) {
      console.error('Error al editar la Ruta:', error);
      $q.notify({ type: 'negative', color: 'negative', message: error.response.data.error.errors[0].msg });
    }
  } else {
    const nuevoRuta = {
      origen: origen.value,
      destino: destino.value,
      horarios: horarios.value,
      distancia: distancia.value,
      duracion: duracion.value,
      fecha: fecha.value.split('T')[0],
    };
    try {
      await rutaStore.agregarRuta(nuevoRuta);
      origen.value = "";
      destino.value = "";
      horarios.value = "";
      distancia.value = "";
      duracion.value = "";
      fecha.value = "";
      modal.value = false;
      $q.notify({
        message: 'Ruta agregado correctamente',
        textColor: 'white',
        type: "positive",
        color: 'green',
      });
      obtenerRuta();
      limpiar();
    } catch (error) {
      console.error('Error al agregar la ruta:', error);
      $q.notify({ type: 'negative', color: 'negative', message: error.response.data.error.errors[0].msg });
    }
  }
  cargando.value = false;
  modalAbierto.value = false;
}

const editarRuta = (ruta) => {
  origen.value = ruta.origen;
  destino.value = ruta.destino;
  horarios.value = ruta.horarios;
  distancia.value = ruta.distancia;
  duracion.value = ruta.duracion;
  fecha.value = ruta.fecha;
  rutaEditando.value = ruta;
  modal.value = true;
  $q.notify({
        message: "Editando una ruta",
        textColor: 'white',
        icon: "edit",
        color: 'info',
      });
}

const limpiar = () => {
  origen.value = "";
  destino.value = "";
  horarios.value = "";
  distancia.value = "";
  duracion.value = "";
  fecha.value = "";
};

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

</script>
    
<style scoped>
.q-card {
  display: flex;
  width: 100%;
  height: 60%;
  flex-direction: column;
  align-items: center;
}

.btna {
  background-color: #1976d2;
}
.btnc {
  background-color: rgb(210, 25, 25);
}
.inputDatos {
  width: 340px;
  height: 3vh;
  border: none;
  background-color: rgba(241, 233, 233, 0.589);
  border-radius: 10px;
  margin: 8px;
}

.btnEditar {
  margin: 5px;
}

label {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.agre {
  display: flex;
  justify-content: flex-end;
}
.title {
  display: flex;
  flex-direction: column;
  align-items: center;
}
h3 {
  font-weight: bold;
}

.raya {
  background-color: rgba(50, 107, 253, 0.85);
  width: 50%;
  height: 5px;
}

.arri {
  display: flex;
  justify-content: center;
  background-color: #1976d2;
  color: #ffffff;
  width: 100%;
}
</style>
    
  