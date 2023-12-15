<template>
  <div class="q-pa-md">
    <div class="cargar_contenedor">
      <div class="title">
        <h3>Datos Buses</h3>

      </div>

      <div class="spinner-container" v-if="cargando">
        <q-spinner-hourglass size="100px" color="primary" />
        <p class="p-carga">Cargando...</p>
      </div>

      <div class="contenedor_TD" v-else>
        <div class="raya"></div>
        <br>
        <div class="agre">
          <q-btn label="Agregar" color="blue" @click="modal = true" />
        </div>
        <br />

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

        <q-dialog v-model="modal" no-backdrop-dismiss>
          <q-card class="conten_modal">
            <q-card-section class="arri">
              <div class="text-h6">DATOS DE BUSES
                <q-btn flat class="btn_A1" label="❌" color="white" @click="limpiar" v-close-popup />
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <div class="imagen_formulario">
                <div class="infoDatos">
                  <div class="conten_input">
                    <label for="PLACA">Placa</label>
                    <div class="containerInput">
                      <input placeholder="Placa" type="text" id="PLACA" v-model="placa" autocomplete="on" />
                    </div>
                    <span>{{ errorPlaca }}</span>
                  </div>
                  <br />
                  <div class="conten_input">
                    <label for="NUMERO">Numero de bus</label>
                    <div class="containerInput">
                      <input placeholder="Numero" type="number" id="NUMERO" v-model="numero" autocomplete="on" />
                    </div>
                    <span>{{ errorNumero }}</span>
                  </div>
                  <br />
                  <label for="">Conductor</label>
                  <q-select class="input" filled v-model="conductor" use-input hide-selected fill-input
                    input-debounce="0" :options="opcionesConductorFiltro" @filter="filterFn"
                    style="width: 100%; border: 1px solid black; border-radius: 5px; height: 1%; background: rgba(255, 255, 255, 0);">
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                  <span>{{ errorConductor }}</span>
                  <br />
                  <div class="conten_input">
                    <label for="MODELO">Modelo</label>
                    <div class="containerInput">
                      <input placeholder="Modelo" type="number" id="MODELO" v-model="modelo" autocomplete="on" />
                    </div>
                    <span>{{ errorModelo }}</span>
                  </div>
                  <br />
                  <div class="conten_input">
                    <label for="SOAT">Soat</label>
                    <div class="containerInput">
                      <input placeholder="Soat" type="date" id="SOAT" v-model="soat" autocomplete="on" />
                    </div>
                    <span>{{ errorSoat }}</span>
                  </div>
                  <br />
                  <div class="conten_input">
                    <label for="NUMERO DE ASIENTOS">Numero de asientos</label>
                    <div class="containerInput">
                      <input placeholder="Numero de asientos" type="number" id="N_ASIENTO" v-model="n_asiento"
                        autocomplete="on" />
                    </div>
                    <span>{{ errorAsiento }}</span>
                  </div>
                  <br />
                  <div class="conten_input">
                    <label for="EMPRESA_ASIGNADA">Empresa asignada </label>
                    <div class="containerInput">
                      <input placeholder="Empresa asignada" type="text" id="EMPRESA_ASIGNADA" v-model="empresa_asignada"
                        autocomplete="on" />
                    </div>
                    <span>{{ errorEmpresa }}</span>
                  </div>
                </div>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-actions align="right">
              <q-btn flat label="Cerrar" class="btnc" @click="limpiar" color="white" v-close-popup />
              <q-btn flat label="Aceptar" class="btna" @click="agregarEditarBus" color="white" :loading="load" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useBusStore } from "../stores/bus.js";
import { useQuasar } from "quasar";
import { format } from "date-fns";
import { useConductorStore } from "../stores/conductor";

const busStore = useBusStore();
const conductorStore = useConductorStore();

const rows = ref([]);
const modal = ref(false);
const placa = ref("");
const numero = ref("");
const modelo = ref("");
const conductor = ref("");
const soat = ref("");
const n_asiento = ref("");
const empresa_asignada = ref("");
const busEditando = ref(null);
const $q = useQuasar();
const options = ref([])
const cargando = ref(false);
const modalAbierto = ref(false);
const opcionesConductor = ref([]);
const load = ref(false)

const opcionesConductorFiltro = ref(opcionesConductor.value)
function filterFn(val, update) {
  console.log(val);
  if (val === "") {
    update(() => {
      opcionesConductorFiltro.value = opcionesConductor.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    opcionesConductorFiltro.value = opcionesConductor.value.filter(
      (v) => {
        console.log("v", v);
        return v.label.toLowerCase().indexOf(needle) > -1
      }
    );
  });
}

const columns = [
  { name: "placa", required: true, label: "Placa", align: "center", field: "placa", format: (val) => val, },
  { name: "numero", required: true, label: "Número de bus", align: "center", field: "numero", sortable: true, },
  { name: "conductor", required: true, label: "Conductor", align: "center", field: (row) => row.conductor.nombre, sortable: true, },
  { name: "modelo", required: true, label: "Modelo", align: "center", field: "modelo", sortable: true, },
  { name: "soat", required: true, label: "Soat", align: "center", field: "soat", sortable: true, format: (val) => { return format(new Date(val), "yyyy-MM-dd"); }, },
  { name: "n_asiento", required: true, label: "Número de asientos", align: "center", field: "n_asiento", sortable: true, },
  { name: "empresa_asignada", required: true, label: "Empresa_asignada", align: "center", field: "empresa_asignada", sortable: true, },
  { name: "status", label: "Estado", align: "center", field: "status", sortable: true, },
  { name: "acciones", required: true, label: "Acciones", align: "center", field: "acciones", },
];

async function obtenerBus() {
  try {
    cargando.value = true
    const buses = await busStore.obtener();
    console.log("Buses obtenidos:", buses);
    rows.value = buses.busesPopulate.reverse();
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
  } finally {
    cargando.value = false;
  }
}


const conductores = ref([])

async function obtenerConductor() {
  try {
    const response = await conductorStore.obtener();
    const conductoresActivos = response.filter((conductor) => conductor.status === 1);
    conductores.value = conductoresActivos;
    opcionesConductor.value = conductoresActivos.map((conductor) => ({ label: conductor.nombre, value: conductor._id }));
  } catch (error) {
    console.error("Error al obtener los conductores", error);
  }
}

const clearErrors = () => {
  setTimeout(() => {
    errorPlaca.value = "";
    errorConductor.value = "";
    errorNumero.value = "";
    errorModelo.value = "";
    errorSoat.value = "";
    errorAsiento.value = "";
    errorEmpresa.value = "";
  }, 4000);
};

let errorPlaca = ref("");
let errorNumero = ref("");
let errorConductor = ref("");
let errorModelo = ref("");
let errorSoat = ref("");
let errorAsiento = ref("");
let errorEmpresa = ref("");


const agregarEditarBus = async () => {
  cargando.value = true;
  modalAbierto.value = true;

  if (!placa.value.trim()) {
    errorPlaca.value = "Por favor, ingresar la placa del bus";
    cargando.value = false;
    clearErrors();
    return;
  } else {
    errorPlaca.value = "";
  }


  if (!numero.value) {
    errorNumero.value = "Por favor, ingresar el número del bus";
    cargando.value = false;
    clearErrors();
    return;
  } else if (numero.value <= 0) {
    errorNumero.value = "El numero ingresado debe ser mayor a 0"
    cargando.value = false;
    clearErrors();
  } else{
    errorNumero.value = "";
  }

  if (!conductor.value) {
    errorConductor.value = "Por favor, seleccionar un conductor para el bus";
    cargando.value = false;
    clearErrors();
    return;
  } else {
    errorConductor.value = "";
  }

  if (!modelo.value) {
    errorModelo.value = "Por favor, ingresar un modelo para el bus";
    cargando.value = false;
    clearErrors();
    return;
  } else if (modelo.value <= 0) {
    errorModelo.value = "El numero ingresado debe ser mayor a 0"
    cargando.value = false;
    clearErrors();
  } else {
    errorModelo.value = "";
  }

  if (!soat.value) {
    errorSoat.value = "Por favor, ingresar un SOAT";
    cargando.value = false;
    clearErrors();
    return;
  } else {
    errorSoat.value = "";
  }

  const fechaActual = new Date();
  const fechaSeleccionada = new Date(soat.value);

  if (fechaSeleccionada < fechaActual) {
    errorSoat.value = "La fecha no puede ser menor que la actual";
    cargando.value = false;
    clearErrors();
    return;
  } else {
    errorSoat.value = "";
  }

  if (!n_asiento.value) {
    errorAsiento.value = "Por favor, ingresar el número de asientos del bus";
    cargando.value = false;
    clearErrors();
    return;
  } else if (n_asiento.value <= 0) {
    errorAsiento.value = "El número de asientos debe ser mayor que 0";
    cargando.value = false;
    clearErrors();
    return;
  } else {
    errorAsiento.value = "";
  }


  if (!empresa_asignada.value.trim()) {
    errorEmpresa.value = "Por favor, ingresar la empresa asignada del bus";
    cargando.value = false;
    clearErrors();
    return;
  } else {
    errorEmpresa.value = "";
  }

  if (busEditando.value) {
    const busEditado = {
      _id: busEditando.value._id,
      placa: placa.value,
      numero: numero.value,
      conductor: conductor.value.value,
      modelo: modelo.value,
      soat: soat.value,
      n_asiento: n_asiento.value,
      empresa_asignada: empresa_asignada.value,
    };
    try {
      load.value = true
      await busStore.editarBus(busEditado);
      load.value = false
      placa.value = "";
      numero.value = "";
      conductor.value = "";
      modelo.value = "";
      soat.value = "";
      n_asiento.value = "";
      empresa_asignada.value = "";
      modal.value = false;
      busEditando.value = null;
      $q.notify({
        message: "Bus editado correctamente",
        textColor: "white",
        type: "positive",
        color: "green",
      });
      obtenerBus();
    } catch (error) {
      load.value = false
      console.error("Error al editar el bus:", error);
      $q.notify({
        type: "negative",
        color: "negative",
        message: error.response.data.error,
      });
    }
  } else {
    const nuevoBus = {
      placa: placa.value,
      numero: numero.value,
      conductor: conductor.value.value,
      modelo: modelo.value,
      soat: soat.value,
      n_asiento: n_asiento.value,
      empresa_asignada: empresa_asignada.value,
    };
    try {
      load.value=true
      await busStore.agregarBus(nuevoBus);
      load.value=false
      placa.value = "";
      numero.value = "";
      conductor.value = "";
      modelo.value = "";
      soat.value = "";
      n_asiento.value = "";
      empresa_asignada.value = "";
      modal.value = false;
      $q.notify({
        message: "Bus agregado correctamente",
        textColor: "white",
        type: "positive",
        color: "green",
      });
      obtenerBus();
      limpiar();
    } catch (error) {
      load.value = false
      console.error("Error al agregar el bus:", error);
      $q.notify({
        type: "negative",
        color: "negative",
        message: error.response.data.error,
      });
    }
  }
  cargando.value = false;
  modalAbierto.value = false;
};

const editarBus = (bus) => {
  placa.value = bus.placa;
  numero.value = bus.numero;
  conductor.value = {
    label: `${bus.conductor.nombre}`,
    value: String(bus.conductor._id),
  };
  modelo.value = bus.modelo;
  const fechaFormateada = format(new Date(bus.soat), "yyyy-MM-dd");
  soat.value = fechaFormateada;
  n_asiento.value = bus.n_asiento;
  empresa_asignada.value = bus.empresa_asignada;
  busEditando.value = bus;
  modal.value = true;
  $q.notify({
    message: `Editando al bus ${bus.empresa_asignada} - ${bus.numero}`,
    textColor: "white",
    icon: "edit",
    color: "info",
  });
};

const limpiar = () => {
  placa.value = "";
  numero.value = "";
  conductor.value = "";
  modelo.value = "";
  soat.value = "";
  n_asiento.value = "";
  empresa_asignada.value = "";
};

async function activar(id) {
  try {
    const bus = await busStore.activarBus(id);
    obtenerBus();
  } catch (error) {
    console.error("Error al activar Bus:", error);
  }
}

async function desactivar(id) {
  try {
    const bus = await busStore.desactivarBus(id);

    obtenerBus();
  } catch (error) {
    console.error("Error al desactivar Bus:", error);
  }
}

onMounted(() => {
  obtenerBus();
  obtenerConductor();
});
</script>

<style scoped>
.btna {
  background-color: #1976d2;
}

.btnc {
  background-color: rgb(210, 25, 25);
}

.spinner-container {
  display: grid;
  margin: 0%;
  justify-content: center;
  align-items: center;
  height: 50vh;
}

.p-carga {
  position: relative;
  bottom: 85px;
  font-size: 20px;
  font-weight: 600;
}

.btn_A1 {
  position: relative;
  left: 80%;
}

.text-h6 {
  display: flex;
  align-items: center;
}

.color1 {
  color: #51ff00;
}

.color2 {
  color: #f50a0a;
}

span {
  color: red;
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
  width: 70%;
  height: 5px;
  margin: auto;
  background-color: rgba(82, 131, 253, 0.85);
}

.infoDatos {
  width: 55%;
}

.q-card__section--vert {
  padding: 0px;
}

.imagen_formulario {
  background-image: url("../assets/logo.PNG");
  background-size: cover;
  /* Esto ajustará la imagen para que quepa en el contenedor */
  background-position: center;
  padding: 15px;
}

.conten_modal {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.containerInput {
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
  content: "";
  width: 110%;
  aspect-ratio: 1;
  position: absolute;
  inset: 0 0 0 0;
  margin: auto;
  animation: rotate6234 2.5s ease-in-out infinite;
  z-index: -1;
  background-image: conic-gradient(from 0deg at 50% 50%,
      #073aff00 0%,
      rgb(28, 49, 235) 25%,
      #073aff00 25%);
}

.containerInput>input {
  width: 100%;
  height: 35px;
  font-size: inherit;
  border: none;
  padding: 12px;
  background-color: #ffffff;
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
  background: linear-gradient(90deg,
      #1976d2,
      #1976d2,
      #1976d2,
      #1976d2,
      #50a3f7);
  color: #ffffff;
  width: 100%;
}

@media (max-width: 500px) {
  .infoDatos {
    width: 95%;
  }

  .imagen_formulario {
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    padding: 15px;
  }
}
</style>
