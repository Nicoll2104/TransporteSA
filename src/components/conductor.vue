<template>
  <div class="q-pa-md">

  <div class="title"><h3>Datos Conductores</h3>
  <div class="raya"></div>
</div><br><br>

    <div class="agre"><q-btn label="Agregar" color="blue" @click="modal = true" /></div><br><br>

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
      <q-card>

        <q-card-section class="arri">
          <div class="text-h6">DATOS DE CONDUCTORES</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">
          <div class="infoDatos">
            <div class="ilDatos">
              <label class="labelDatos" for="cedula">Cedula:</label>
              <input
                class="inputDatos"
                type="text"
                id="cedula"
                v-model="cedula"
              />
            </div><br>

            <div class="ilDatos">
              <label class="labelDatos" for="nombre">Nombre:</label>
              <input
                class="inputDatos"
                type="text"
                id="nombre"
                v-model="nombre"
              />
            </div><br>

            <div class="ilDatos">
              <label class="labelDatos" for="n_licencia">Numero de licencia:</label>
              <input
                class="inputDatos"
                type="text"
                id="n_licencia"
                v-model="n_licencia"
              />
            </div><br>

            <div class="ilDatos">
              <label class="labelDatos" for="direccion">Direccion:</label>
              <input
                class="inputDatos"
                type="text"
                id="direccion"
                v-model="direccion"
              />
            </div><br>

            <div class="ilDatos">
              <label class="labelDatos" for="telefono">Telefono:</label>
              <input
                class="inputDatos"
                type="text"
                id="telefono"
                v-model="telefono"
              />
            </div><br>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn
            flat
            class="btn_AC"
            label="Cerrar"
            color="primary"
            @click="limpiar"
            v-close-popup
          />
          <q-btn
            flat
            class="btn_AC"
            label="Aceptar"
            color="primary"
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
import { useQuasar } from 'quasar'

const conductorStore = useConductorStore();

const modal = ref(false);
const rows = ref([]);
const cedula = ref("");
const nombre = ref("");
const n_licencia = ref("");
const direccion = ref("");
const telefono = ref("");
const conductorEditando = ref(null);
const $q = useQuasar()

const cargando = ref(false);
const modalAbierto = ref(false);

const columns = [
  { name: "cedula", required: true, label: "Cédula", align: "center", field: "cedula", sortable: true },
  { name: "nombre", required: true, label: "Nombre", align: "center", field: "nombre", sortable: true },
  { name: "n_licencia", required: true, label: "N_licencia", align: "center", field: "n_licencia", sortable: true },
  { name: "direccion", required: true, label: "Direccion", align: "center", field: "direccion", sortable: true },
  { name: "telefono", required: true, label: "Teléfono", align: "center", field: "telefono", sortable: true },
  { name: "status", label: "Status", align: "center", field: "status", sortable: true },
  { name: "acciones", required: true, label: "Acciones", align: "center", field: "acciones", },
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
        message: 'Conductor editado correctamente',
        textColor: 'white',
        type: "positive",
        color: 'green',
      });
      obtenerConductor();
    } catch (error) {
      console.error("Error al editar el conductor:", error);
      $q.notify({ type: 'negative', color: 'negative', message: 'Error al editar el conductor' });
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
        message: 'Conductor agregado correctamente',
        textColor: 'white',
        type: "positive",
        color: 'green',
      });
      obtenerConductor();
      limpiar();
    } catch (error) {
      console.error("Error al agregar el conductor:", error);
      $q.notify({ type: 'negative', color: 'negative', message: 'Error al agregar el conductor' });
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
    console.log("conductor activado:", conductor);
    obtenerConductor();
  } catch (error) {
    console.error("Error al activar conductor:", error);
  }
}

async function desactivar(id) {
  try {
    const conductor = await conductorStore.desactivarConductor(id);
    console.log("conductor desactivado:", conductor);
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

.q-card{
    display: flex;
    width: 50%;
    height: 60%;
    align-items: center;
    flex-direction: column;
    justify-content: space-around;
}

.btn_AC {
  background: linear-gradient(0deg, rgb(23, 106, 231), rgb(228, 226, 226));
  color: rgb(255, 255, 255);
}

.color1 {
  color: rgb(136, 226, 0);
}

.color2 {
  color: red;
}

.infoDatos{
    display: flex;
    align-items: flex-end;
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

}

.inputDatos {
  width: 200px;

}

.btnEditar {
  margin: 5px;
  
}

label {
  margin-right: 20px;
}

.agre{
  display: flex;
  justify-content: flex-end;
}
.title{
  display: flex;
    flex-direction: column;
    align-items: center;
}
h3{
  font-weight: bold;
}

.raya{
  background-color: rgba(50, 107, 253, 0.85);
  width: 50%;
  height: 5px;
}

</style>
    
