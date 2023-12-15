<template>
  <div class="q-pa-md">
    <div class="cargar_contenedor">
      <div class="title">
        <h3>Datos Conductores</h3>
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


        <q-table title="DATOS CONDUCTORES" :rows="rows" :columns="columns" row-key="cedula">
          <template v-slot:body-cell-status="props">
            <q-td key="status" :props="props">
              <span class="color1" v-if="props.row.status == 1">Activo</span>
              <span class="color2" v-else>Inactivo</span>
            </q-td>
          </template>

          <template v-slot:body-cell-acciones="props">
            <q-td key="acciones" :props="props">
              <q-btn class="btnEditar" icon="edit" color="blue" @click="editarConductor(props.row)"></q-btn>
              <q-btn class="btnActivar" v-if="props.row.status == 1" @click="desactivar(props.row._id)">❌</q-btn>
              <q-btn class="btnActivar" v-else @click="activar(props.row._id)">✅</q-btn>
            </q-td>
          </template>
        </q-table>



        <q-dialog v-model="modal" no-backdrop-dismiss>
          <q-card class="conten_modal">
            <q-card-section class="arri">
              <div class="text-h6">DATOS DE CONDUCTORES
                <q-btn flat class="btn_A1" label="❌" color="white" @click="limpiar" v-close-popup />
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <div class="imagen_formulario">
                <div class="infoDatos">
                  <div class="conten_input">
                    <label for="CEDULA">Cedula</label>
                    <div class="containerInput">
                      <input placeholder="Cedula" type="number" id="CEDULA" v-model="cedula" autocomplete="on">
                    </div>
                    <span class="error">{{ errorCedula }}</span>
                  </div>
                  <br>
                  <div class="conten_input">
                    <label for="NOMBRE">Nombre</label>
                    <div class="containerInput">
                      <input placeholder="Nombre" type="text" id="NOMBRE" v-model="nombre" autocomplete="on">
                    </div>
                    <span class="error">{{ errorNombre }}</span>
                  </div>
                  <br>
                  <div class="conten_input">
                    <label for="N_LICENCIA">Numero de licencia</label>
                    <div class="containerInput">
                      <input placeholder="Numero de licencia" type="number" id="N_LICENCIA" v-model="n_licencia"
                        autocomplete="on">
                    </div>
                    <span class="error">{{ errorN_licencia }}</span>
                  </div>
                  <br>
                  <div class="conten_input">
                    <label for="DIRECCION">Direccion</label>
                    <div class="containerInput">
                      <input placeholder="Direccion" type="text" id="DIRECCION" v-model="direccion" autocomplete="on">
                    </div>
                    <span class="error">{{ errorDireccion }}</span>
                  </div>
                  <br>
                  <div class="conten_input">
                    <label for="TELEFONO">Telefono</label>
                    <div class="containerInput">
                      <input placeholder="Telefono" type="number" id="TELEFONO" v-model="telefono" autocomplete="on">
                    </div>
                    <span class="error">{{ errorTelefono }}</span>
                  </div>
                </div>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-actions align="right">
              <q-btn flat class="btn_A" label="Cerrar" color="white" @click="limpiar" v-close-popup />
              <q-btn flat class="btn_AC" label="Aceptar" color="white" @click="agregarEditarConductor"
                :loading="load" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </div>
</template>
    
<script setup>
import { onMounted, ref } from "vue";
import { useConductorStore } from "../stores/conductor.js";
import { useQuasar } from "quasar";

const conductorStore = useConductorStore();

const modal = ref(false);
const rows = ref([]);
const cedula = ref("");
const nombre = ref("");
const n_licencia = ref("");
const direccion = ref("");
const telefono = ref("");
const conductorEditando = ref(null);
const $q = useQuasar();
const load = ref(false)
const cargando = ref(false);
const modalAbierto = ref(false);

const columns = [
  {
    name: "cedula",
    required: true,
    label: "Cédula",
    align: "center",
    field: "cedula",
    sortable: true,
  },
  {
    name: "nombre",
    required: true,
    label: "Nombre",
    align: "center",
    field: "nombre",
    sortable: true,
  },
  {
    name: "n_licencia",
    required: true,
    label: "Numero de licencia",
    align: "center",
    field: "n_licencia",
    sortable: true,
  },
  {
    name: "direccion",
    required: true,
    label: "Direccion",
    align: "center",
    field: "direccion",
    sortable: true,
  },
  {
    name: "telefono",
    required: true,
    label: "Teléfono",
    align: "center",
    field: "telefono",
    sortable: true,
  },
  {
    name: "status",
    label: "Estado",
    align: "center",
    field: "status",
    sortable: true,
  },
  { name: "acciones", required: true, label: "Acciones", align: "center", field: "acciones" },
];

async function obtenerConductor() {
  try {
    cargando.value = true;
    const conductores = await conductorStore.obtener();
    console.log("conductores obtenidos:", conductores);
    rows.value = conductorStore.datosData.reverse();
  } catch (error) {
    console.error("Error al obtener los conductores:", error);
  } finally {
    cargando.value = false;
  }
}

const errorCedula = ref("");
const errorNombre = ref("");
const errorN_licencia = ref("");
const errorDireccion = ref("");
const errorTelefono = ref("");

const agregarEditarConductor = async () => {


  if (!nombre.value.trim()) {
    errorNombre.value = "Por favor, ingresa tu nombre";
    clearErrors();
    console.log("Error de nombre");
    return;
  }

  if (!direccion.value.trim()) {
    errorDireccion.value = "Por favor, ingresa tu dirección";
    clearErrors();
    console.log("Error de direccion");
    return;
  }


  if (conductorEditando.value) {
    const conductorEditado = {
      _id: conductorEditando.value._id,
      cedula: cedula.value,
      nombre: nombre.value,
      n_licencia: n_licencia.value,
      direccion: direccion.value,
      telefono: telefono.value,
    };
    try {
      load.value = true
      await conductorStore.editarConductor(conductorEditado);
      load.value = false
      cedula.value = "";
      nombre.value = "";
      n_licencia.value = "";
      direccion.value = "";
      telefono.value = "";
      modal.value = false;
      conductorEditando.value = null;
      $q.notify({
        message: "Conductor actualizado correctamente",
        textColor: "white",
        type: "positive",
        color: "green",
      });
      obtenerConductor();
    } catch (error) {
      load.value = false
      console.error("Error al editar el conductor:", error);
      $q.notify({ type: 'negative', color: 'negative', message: error.response.data.error });
    }
  } else {
    const nuevoConductor = {
      cedula: cedula.value,
      nombre: nombre.value,
      n_licencia: n_licencia.value,
      direccion: direccion.value,
      telefono: telefono.value,
    };
    try {
      load.value=true
      await conductorStore.agregarConductor(nuevoConductor);
      load.value=false
      cedula.value = "";
      nombre.value = "";
      n_licencia.value = "";
      direccion.value = "";
      telefono.value = "";
      modal.value = false;
      $q.notify({
        message: "Conductor agregado correctamente",
        textColor: "white",
        type: "positive",
        color: "green",
      });
      obtenerConductor();
      limpiar();
    } catch (error) {
      load.value = false
      console.error("Error al agregar el conductor:", error);
      $q.notify({ type: 'negative', color: 'negative', message: error.response.data.error });
    }
  }
  cargando.value = false;
  modalAbierto.value = false;
};

const editarConductor = (conductor) => {
  cedula.value = conductor.cedula;
  nombre.value = conductor.nombre;
  n_licencia.value = conductor.n_licencia;
  direccion.value = conductor.direccion;
  telefono.value = conductor.telefono;
  conductorEditando.value = conductor;
  modal.value = true;
  $q.notify({
    message: `Editando al conductor ${conductor.nombre}`,
    textColor: 'white',
    icon: "edit",
    color: 'info',
  });
};

const clearErrors = () => {
  setTimeout(() => {
    errorCedula.value = "";
    errorNombre.value = "";
    errorN_licencia.value = "";
    errorDireccion.value = "";
    errorTelefono.value = "";
  }, 4000);
};

const limpiar = () => {
  cedula.value = "";
  nombre.value = "";
  n_licencia.value = "";
  direccion.value = "";
  telefono.value = "";
};

async function activar(id) {
  try {
    const conductor = await conductorStore.activarConductor(id);
    obtenerConductor();
  } catch (error) {
    console.error("Error al activar conductor:", error);
  }
}

async function desactivar(id) {
  try {
    const conductor = await conductorStore.desactivarConductor(id);
    obtenerConductor();
  } catch (error) {
    console.error("Error al desactivar conductor:", error);
  }
}

onMounted(() => {
  obtenerConductor();
});
</script>

    
<style scoped>
.btn_AC {
  background-color: #1976d2;
}

.btn_A {
  background-color: rgb(210, 25, 25);
}

.btn_A1 {
  position: relative;
  left: 40%;
}

.text-h6 {
  display: flex;
  align-items: center;
}

.btnEditar {
  margin: 5px;
}

.color1 {
  color: #51ff00;
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

.color2 {
  color: #f50a0a;
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

.error {
  color: red;
}
</style>
    
