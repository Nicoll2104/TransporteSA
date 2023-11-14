<template>
  <div class="q-pa-md">
    <div class="cargar_contenedor">
      <div class="title">
        <h3>Datos Buses</h3>
        <div class="raya"></div>
      </div><br>


      <div class="agre"><q-btn label="Agregar" color="blue" @click="modal = true" /></div><br>

      <q-table title="DATOS BUSES" :rows="rows" :columns="columns" row-key="cedula">
        <template v-slot:body-cell-status="props">
          <q-td key="status" :props="props">
            <span class="color1" v-if="props.row.status == 1">Activo</span>
            <span class="color2" v-else>Inactivo</span>
          </q-td>
        </template>
        <template v-slot:body-cell-acciones="props">
          <q-td key="acciones" :props="props">
            <q-btn class="btnEditar" icon="edit" color="primary" @click="editarBus(props.row)"></q-btn>
            <q-btn class="btnActivar" v-if="props.row.status == 1" @click="desactivar(props.row._id)">❌</q-btn>
            <q-btn class="btnActivar" v-else @click="activar(props.row._id)">✅</q-btn>
          </q-td>
        </template>
      </q-table>


      <q-dialog v-model="modal">
        <q-card class="conten_modal">
          <q-card-section class="arri">
            <div class="text-h6">DATOS DE BUSES</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="imagen_formulario">
            <div class="infoDatos">
              <div class="conten_input">
                <label for="PLACA">Placa</label>
                <div class="containerInput">
                  <input placeholder="Placa" type="text" id="PLACA" v-model="placa" autocomplete="on">
                </div>
              </div>
              <br>
              <div class="conten_input">
                <label for="MODELO">Modelo</label>
                <div class="containerInput">
                  <input placeholder="Modelo" type="text" id="MODELO" v-model="modelo" autocomplete="on">
                </div>
              </div>
              <br>
              <q-select color="teal" filled v-model="modeloBus" :options="opcionesConductor" label="Label">
              <template v-slot:prepend>
                <q-icon name="event" />
              </template>
              </q-select>
              <br>
              <div class="conten_input">
                <label for="SOAT">Soat</label>
                <div class="containerInput">
                  <input placeholder="Soat" type="date" id="SOAT" v-model="soat" autocomplete="on">
                </div>
              </div>
              <br>
              <div class="conten_input">
                <label for="N_ASIENTO">Numero de asientos</label>
                <div class="containerInput">
                  <input placeholder="Numero de asientos" type="number" id="N_ASIENTO" v-model="n_asiento"
                    autocomplete="on">
                </div>
              </div>
              <br>
              <div class="conten_input">
                <label for="EMPRESA_ASIGNADA">Empresa asignada </label>
                <div class="containerInput">
                  <input placeholder="Empresa asignada" type="text" id="EMPRESA_ASIGNADA" v-model="empresa_asignada"
                    autocomplete="on">
                </div>
              </div>
            </div>
          </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn flat label="Cerrar" class="btnc" @click="limpiar" color="white" v-close-popup />
            <q-btn flat label="Aceptar" class="btna" @click="agregarEditarBus" color="white" :loading="cargando" />
          </q-card-actions>

        </q-card>
      </q-dialog>

    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useBusStore } from '../stores/bus.js';
import { useQuasar } from 'quasar'
import { format } from 'date-fns';
import { useConductorStore } from "../stores/conductor";

const busStore = useBusStore()
const conductorStore = useConductorStore();

const rows = ref([])
const modal = ref(false);
const placa = ref("");
const modelo = ref("");
const modeloBus = ref("");
const conductor = ref("");
const soat = ref("");
const n_asiento = ref("");
const empresa_asignada = ref("");
const busEditando = ref(null);
const $q = useQuasar()

const cargando = ref(false);
const modalAbierto = ref(false);


const columns = [
  { name: "placa", required: true, label: "Placa", align: "center", field: "placa", format: (val) => val, },
  { name: "modelo", required: true, label: "Modelo", align: "center", field: "modelo", sortable: true },
  { name: "conductor", required: true, label: "Conductor", align: "center", field: "conductor", sortable: true },
  {
    name: "soat",
    required: true,
    label: "Soat",
    align: "center",
    field: "soat",
    sortable: true,
    format: (val) => {
      return format(new Date(val), "yyyy-MM-dd");
    },
  },
  { name: "n_asiento", required: true, label: "Número de asientos", align: "center", field: "n_asiento", sortable: true },
  { name: "empresa_asignada", required: true, label: "Empresa_asignada", align: "center", field: "empresa_asignada", sortable: true },
  { name: "status", label: "Estado", align: "center", field: "status", sortable: true },
  { name: "acciones", required: true, label: "Acciones", align: "center", field: "acciones", },
];

async function obtenerBus() {
  try {
    const buses = await busStore.obtener();
    console.log('Buses obtenidos:', buses);
    rows.value = buses.busesPopulate
  } catch (error) {
    console.error('Error al obtener los clientes:', error);
  }
}

const opcionesConductor = ref([]);

async function obtenerConductor() {
  try {
    const response = await conductorStore.obtener();
      opcionesConductor.value = response.map((conductor) => (
        conductor.nombre
      ));
  } catch (error) {
    console.error('Error al obtener los conductores', error);
  }
}

const agregarEditarBus = async () => {
  cargando.value = true;
  modalAbierto.value = true;

  if (busEditando.value) {
    const busEditado = {
      _id: busEditando.value._id,
      placa: placa.value,
      modelo: modelo.value,
      conductor: modelo.value,
      soat: soat.value,
      n_asiento: n_asiento.value,
      empresa_asignada: empresa_asignada.value,
    };
    try {
      await busStore.editarBus(busEditado);
      placa.value = "";
      modelo.value = "";
      conductor.value = "";
      soat.value = "";
      n_asiento.value = "";
      empresa_asignada.value = "";
      modal.value = false;
      busEditando.value = null;
      $q.notify({
        message: 'Bus editado correctamente',
        textColor: 'white',
        type: "positive",
        color: 'green',
      });
      obtenerBus();
    } catch (error) {
      console.error('Error al editar el bus:', error);
      $q.notify({ type: 'negative', color: 'negative', message: error.response.data.error.errors[0].msg });
    }
  } else {
    const nuevoBus = {
      placa: placa.value,
      modelo: modelo.value,
      conductor: modelo.value,
      soat: soat.value,
      n_asiento: n_asiento.value,
      empresa_asignada: empresa_asignada.value,
    };
    try {
      await busStore.agregarBus(nuevoBus);
      placa.value = "";
      modelo.value = "";
      conductor.value = "";
      soat.value = "";
      n_asiento.value = "";
      empresa_asignada.value = "";
      modal.value = false;
      $q.notify({
        message: 'Bus agregado correctamente',
        textColor: 'white',
        type: "positive",
        color: 'green',
      });
      obtenerBus();
      limpiar();
    } catch (error) {
      console.error('Error al agregar el bus:', error);
      $q.notify({ type: 'negative', color: 'negative', message: error.response.data.error.errors[0].msg });
    }
  }
  cargando.value = false;
  modalAbierto.value = false;
}

const editarBus = (bus) => {
  placa.value = bus.placa;
  modelo.value = bus.modelo;
  conductor.value = bus.conductor
  soat.value = bus.soat;
  n_asiento.value = bus.n_asiento;
  empresa_asignada.value = bus.empresa_asignada;
  busEditando.value = bus;
  modal.value = true;
  $q.notify({
    message: `Editando al conductor ${bus.empresa_asignada}`,
    textColor: 'white',
    icon: "edit",
    color: 'info',
  });
}

const limpiar = () => {
  placa.value = "";
  modelo.value = "";
  conductor.value = "";
  soat.value = "";
  n_asiento.value = "";
  empresa_asignada.value = "";
};


async function activar(id) {
  try {
    const bus = await busStore.activarBus(id);
    obtenerBus();
  } catch (error) {
    console.error('Error al activar Bus:', error);
  }
}

async function desactivar(id) {
  try {
    const bus = await busStore.desactivarBus(id);

    obtenerBus();
  } catch (error) {
    console.error('Error al desactivar Bus:', error);
  }
}

onMounted(() => {
  obtenerBus();
  obtenerConductor();
})

</script>


  
<style scoped>
.btna {
  background-color: #1976d2;
}

.btnc {
  background-color: rgb(210, 25, 25);
}


.btnEditar {
  margin: 5px;
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
  width: 70%;
  height: 5px;
  border-radius: 20px;
}

.infoDatos {
  width: 55%;
}

.q-card__section--vert {
    padding: 0px;
}


.imagen_formulario{
  background-image: url("../assets/logo.PNG");
  background-size: cover; /* Esto ajustará la imagen para que quepa en el contenedor */
  background-position: center;
  padding: 15px;
}

.conten_modal {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}


.containerInput {
  background-color: #000000;
  border: 1px solid black;
  position: relative;
  border-radius: 5px 5px 5px 5px;
  overflow: hidden;
  margin: 0;
  padding: 0 0 4px 0;
  z-index: 1;
  font-size: 15px;
}

.containerInput::before {
  content: '';
  width: 110%;
  aspect-ratio: 1;
  position: absolute;
  inset: 0 0 0 0;
  margin: auto;
  animation: rotate6234 2.5s ease-in-out infinite;
  z-index: -1;
  background-image: conic-gradient(from 0deg at 50% 50%, #073AFF00 0%, rgb(28, 49, 235) 25%, #073AFF00 25%);
}

.containerInput>input {
  width: 100%;
  height: 35px;
  font-size: inherit;
  border: none;
  padding: 12px;
  background-color: #ffffff;
  outline: 5px solid #0a0a0a;
}

.containerInput>input:focus {
  outline: none;
}

.containerInput>input:not(:placeholder-shown) {
  outline: none;
}

.containerInput>input:not(:placeholder-shown):valid {
  outline: 4px solid rgb(0, 81, 255);
  border-radius: 0;
}

@keyframes rotate6234 {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.arri {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1976d2;
  height: 50px;
  background: linear-gradient(90deg, #1976d2, #1976d2, #1976d2, #1976d2, #50a3f7);
  color: #ffffff;
  width: 100%;
}

@media (max-width: 500px){
  
  .infoDatos {
    width: 95%;
}

.imagen_formulario{
  background-repeat: no-repeat;
  background-size: contain; 
  background-position: center;
  padding: 15px;
}

}

</style>