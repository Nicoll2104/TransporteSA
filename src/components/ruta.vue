<template>
  <div class="q-pa-md">
    <q-table title="DATOS RUTAS" :rows="DatosData" :columns="columns" row-key="origen">
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
              <input class="inputDatos" type="text" id=" horarios" v-model="horarios" />
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
import { ref } from "vue";
import axios from "axios";

let modal = ref(false)
let DatosData = ref([]);
let origen = ref("");
let destino = ref("");
let horarios = ref("");
let distancia = ref("");
let duracion = ref("");
let fecha = ref("");
let status = ref("");


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

const obtener = async () => {
  try {
    const response = await axios.get("ruta/ver");
    DatosData.value = response.data;
  } catch (error) {
    console.error('Error al obtener rutas:', error);
  }
};

async function AgregarRuta() {
  const data = {
    origen: origen.value,
    destino: destino.value,
    horarios: horarios.value,
    distancia: distancia.value,
    duracion: duracion.value,
    fecha: fecha.value,
    status: status.value
  };

  try {
    let res = await axios.post("ruta/agregar", data);
    console.log(res);

    origen.value = "";
    destino.value = "";
    horarios.value = "";
    distancia.value = "";
    duracion.value = "";
    fecha.value = "";
    status.value = "";

    obtener();
  } catch (error) {
    console.error(error);
  }
}

obtener()

const activar = async (id) => {
const ruta = await axios.put(`ruta/activar/${id}`);
  console.log(ruta);
  if (ruta == null) {
    return;
  }
  const buscar = DatosData.value.findIndex((r) => r._id == id);
  DatosData.value.splice(buscar, 1, ruta.data.ruta);
};

const desactivar = async (id) => {
const ruta = await axios.put(`ruta/inactivar/${id}`);
  console.log(ruta);
  if (ruta == null) {
    return;
  }
  const buscar = DatosData.value.findIndex((r) => r._id == id);
  DatosData.value.splice(buscar, 1, ruta.data.ruta);
};

</script>-
    
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
    
  