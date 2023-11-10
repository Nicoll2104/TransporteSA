<template>
  <div class="q-pa-md">
    <div class="title">
      <h3>Datos Conductores</h3>
      <div class="raya"></div>
    </div>
    <br /><br />

    <div class="agre">
      <q-btn label="Agregar" color="blue" @click="modal = true" />
    </div>
    <br /><br />

    <q-table
      title="DATOS CONDUCTORES"
      :rows="rows"
      :columns="columns"
      row-key="cedula"
    >
      <template v-slot:body-cell-status="props">
        <q-td key="status" :props="props">
          <span class="color1" v-if="props.row.status == 1">Activo</span>
          <span class="color2" v-else>Inactivo</span>
        </q-td>
      </template>

      <template v-slot:body-cell-acciones="props">
        <q-td key="acciones" :props="props">
          <q-btn
            class="btnEditar"
            icon="edit"
            color="blue"
            @click="editarConductor(props.row)"
          ></q-btn>
          <q-btn
            class="btnActivar"
            v-if="props.row.status == 1"
            @click="desactivar(props.row._id)"
            >❌</q-btn
          >
          <q-btn class="btnActivar" v-else @click="activar(props.row._id)"
            >✅</q-btn
          >
        </q-td>
      </template>
    </q-table>


    
    <q-dialog v-model="modal">
      <q-card class="conten_modal">
        <q-card-section class="arri">
          <div class="text-h6">DATOS DE CONDUCTORES</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="imagen_formulario">
          <div class="infoDatos">
            <div class="conten_input">
                <label for="CEDULA">Cedula</label>
                <div class="containerInput">
                  <input placeholder="Cedula" type="text" id="CEDULA" v-model="cedula" autocomplete="on">
                </div>
              </div>
              <br>
              <div class="conten_input">
                <label for="NOMBRE">Nombre</label>
                <div class="containerInput">
                  <input placeholder="Nombre" type="text" id="NOMBRE" v-model="nombre" autocomplete="on">
                </div>
              </div>
              <br>
              <div class="conten_input">
                <label for="N_LICENCIA">Numero de licencia</label>
                <div class="containerInput">
                  <input placeholder="Numero de licencia" type="text" id="N_LICENCIA" v-model="n_licencia" autocomplete="on">
                </div>
              </div>
              <br>
              <div class="conten_input">
                <label for="DIRECCION">Direccion</label>
                <div class="containerInput">
                  <input placeholder="Direccion" type="text" id="DIRECCION" v-model="direccion" autocomplete="on">
                </div>
              </div>
              <br>
              <div class="conten_input">
                <label for="TELEFONO">Telefono</label>
                <div class="containerInput">
                  <input placeholder="Telefono" type="number" id="TELEFONO" v-model="telefono" autocomplete="on">
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn
            flat
            class="btn_A"
            label="Cerrar"
            color="white"
            @click="limpiar"
            v-close-popup
          />
          <q-btn
            flat
            class="btn_AC"
            label="Aceptar"
            color="white"
            @click="agregarEditarConductor"
            :loading="cargando"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
    label: "N_licencia",
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
    label: "Status",
    align: "center",
    field: "status",
    sortable: true,
  },
  {
    name: "acciones",
    required: true,
    label: "Acciones",
    align: "center",
    field: "acciones",
  },
];

async function obtenerConductor() {
  try {
    const conductores = await conductorStore.obtener();
    console.log("conductores obtenidos:", conductores);
    rows.value = conductorStore.datosData;
  } catch (error) {
    console.error("Error al obtener los conductores:", error);
  }
}

const agregarEditarConductor = async () => {
  cargando.value = true;
  modalAbierto.value = true;

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
      await conductorStore.editarConductor(conductorEditado);
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
      console.error("Error al editar el conductor:", error);
      $q.notify({ type: 'negative', color: 'negative', message: error.response.data.error.errors[0].msg });
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
      await conductorStore.agregarConductor(nuevoConductor);
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
      console.error("Error al agregar el conductor:", error);
      $q.notify({ type: 'negative', color: 'negative', message: error.response.data.error.errors[0].msg });
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
    
