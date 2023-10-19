<template>
  <div class="q-pa-md">
    <q-table title="DATOS CONDUCTORES" :rows="DatosData" :columns="columns" row-key="cedula">
      <template v-slot:body-cell-status="props">
        <q-td key="status" :props="props">
          <span class="color1" v-if="props.row.status == 1">Activo</span>
          <span class="color2" v-else >Inactivo</span>
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
          <div class="text-h6">DATOS DE CONDUCTORES</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">
          <div class="infoDatos">
            <div class="ilDatos">
              <label class="labelDatos" for="cedula" >Cedula:</label>
              <input class="inputDatos" type="text" id="cedula" v-model="cedula"  />
            </div>

            <div class="ilDatos">
              <label class="labelDatos" for="nombre" >Nombre:</label>
              <input class="inputDatos" type="text" id="nombre" v-model="nombre" />
            </div>

            <div class="ilDatos">
              <label class="labelDatos" for="n_licencia" >Num_licecia:</label>
              <input class="inputDatos" type="text" id="n_licencia" v-model="n_licencia" />
            </div>

            <div class="ilDatos">
              <label class="labelDatos" for="direccion" >Direccion:</label>
              <input class="inputDatos" type="text" id="direccion" v-model="direccion" />
            </div>

            <div class="ilDatos">
              <label class="labelDatos" for="telefono" >Telefono:</label>
              <input class="inputDatos" type="text" id="telefono" v-model="telefono" />
            </div>


          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
          <q-btn flat label="Aceptar" color="primary" @click="AgregarConductor" v-close-popup />
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
let cedula = ref("");
let nombre = ref("");
let n_licencia = ref("");
let direccion = ref("");
let telefono = ref("");
let status = ref("");

const columns = [
  { name: "cedula", required: true, label: "Cédula", align: "left", field: "cedula", sortable: true },
  { name: "nombre", required: true, label: "Nombre", align: "left", field: "nombre", sortable: true },
  { name: "n_licencia", required: true, label: "N_licencia", align: "left", field: "n_licencia", sortable: true },
  { name: "direccion", required: true, label: "Direccion", align: "left", field: "direccion", sortable: true },
  { name: "telefono", required: true, label: "Teléfono", align: "left", field: "telefono", sortable: true },
  { name: "status", label: "Status", align: "left", field: "status", sortable: true },
  { name: "acciones", required: true, label: "Acciones", align: "center", field: "acciones", },
];

const obtener = async () => {
try {
  const response = await axios.get("conductor/ver");
  console.log("Datos de conductores:", response.data); 
  DatosData.value = response.data;
} catch (error) {
  console.error('Error al obtener conductor:', error);
}
};



async function AgregarConductor() {
  const data = {
    cedula: cedula.value,
    nombre: nombre.value,
    n_licencia: n_licencia.value,
    direccion: direccion.value,
    telefono: telefono.value,
    status: status.value 
  };

  try {
    let res = await axios.post("conductor/agregar", data); 
    console.log(res);
    

    cedula.value = "";
    nombre.value = "";
    n_licencia.value = "";
    direccion.value = "";
    telefono.value = "";
    status.value = "";

  
    obtener();
  } catch (error) {
    console.log(error);
  }
}



obtener()

const activar = async (id) => {
  const conductor = await axios.put(`conductor/activar/${id}`);
    console.log(conductor);
    if (conductor == null) {
      return;
    }
    const buscar = DatosData.value.findIndex((r) => r._id == id);
    DatosData.value.splice(buscar, 1, conductor.data.conductor);
};

const desactivar = async (id) => {
  const conductor = await axios.put(`conductor/inactivar/${id}`);
    console.log(conductor);
    if (conductor == null) {
      return;
    }
    const buscar = DatosData.value.findIndex((r) => r._id == id);
    DatosData.value.splice(buscar, 1, conductor.data.conductor);
};



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

.btnEditar{
  margin: 5px;
}


label {
  margin-right: 20px;
}

</style>
    
