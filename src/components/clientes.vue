<template>
  <div class="q-pa-md">
    <q-table title="DATOS TICKETS" :rows="DatosData" :columns="columns" row-key="cedula">
      <template v-slot:body-cell-status="props">
        <q-td key="status" :props="props">
          <span class="color1" v-if="props.row.status == 1">Activo</span>
          <span class="color2" v-else >Inactivo</span>
        </q-td>
      </template>
      <template v-slot:body-cell-acciones="props">
    <q-td key="acciones" :props="props">
      <q-btn class="btnEditar" icon="edit" color="amber" @click="EditarCliente(props.row)">Editar</q-btn>
      <q-btn class="btnActivar" v-if="props.row.status == 1" @click="desactivar(props.row._id)">❌</q-btn>
      <q-btn class="btnActivar" v-else @click="activar(props.row._id)">✅</q-btn>
    </q-td>
  </template>
    </q-table>
    <q-dialog v-model="modal">
      <q-card>
        <q-card-section>
          <div class="text-h6">DATOS DE CLIENTE</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">
          <div class="infoDatos">
            <div class="ilDatos">
              <label class="labelDatos" for="cedula" >Cedula:</label>
              <input class="inputDatos" type="text" id="cedula" v-model="cedula"  />
            </div>

            <div class="ilDatos">
              <label class="labelDatos" for="telefono" >Nombre:</label>
              <input class="inputDatos" type="text" id="nombre" v-model="nombre" />
            </div>

            <div class="ilDatos">
              <label class="labelDatos" for="telefono" >Telefono:</label>
              <input class="inputDatos" type="text" id="telefono" v-model="telefono" />
            </div>

            <div class="ilDatos">
              <label class="labelDatos" for="email" >Email:</label>
              <input class="inputDatos" type="text" id="email" v-model="email" />
            </div>

          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
          <q-btn flat label="Aceptar" color="primary" @click="AgregarCliente" v-close-popup />
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
let telefono = ref("");
let email = ref("");
let status = ref("");

const columns = [
  { name: "cedula", required: true, label: "Cédula", align: "left", field: "cedula", sortable: true },
  { name: "nombre", required: true, label: "Nombre", align: "left", field: "nombre", sortable: true },
  { name: "telefono", required: true, label: "Teléfono", align: "left", field: "telefono", sortable: true },
  { name: "email", required: true, label: "Email", align: "left", field: "email", sortable: true },
  { name: "status", label: "Status", align: "left", field: "status", sortable: true },
  { name: "acciones", required: true, label: "Acciones", align: "center", field: "acciones", },
];

const obtener = async () => {
  try {
    const response = await axios.get("cliente/ver");
    DatosData.value = response.data; 
  } catch (error) {
    console.error('Error al obtener clientes:', error);
  }
};


async function AgregarCliente() {
  const data = {
    cedula: cedula.value,
    nombre: nombre.value,
    telefono: telefono.value,
    email: email.value,
    status: status.value 
  };

  try {
    let res = await axios.post("https://boleto.onrender.com/api/cliente/agregar", data); 
    console.log(res);
    

    cedula.value = "";
    nombre.value = "";
    telefono.value = "";
    email.value = "";
    status.value = "";

  
    obtener();
  } catch (error) {
    console.log(error);
  }
}

function EditarCliente(cliente) {
  cedula.value = cliente.cedula;
  nombre.value = cliente.nombre;
  telefono.value = cliente.telefono;
  email.value = cliente.email;
  modal.value = true; 
}

obtener()

const activar = async (id) => {
    const cliente = await axios.put(`https://boleto.onrender.com/api/cliente/activar/${id}`);
    console.log(cliente);
    if (cliente == null) {
      return;
    }
    const buscar = DatosData.value.findIndex((r) => r._id == id);
    DatosData.value.splice(buscar, 1, cliente.data.cliente);
};

const desactivar = async (id) => {

    const cliente = await axios.put(`https://boleto.onrender.com/api/cliente/inactivar/${id}`);
    console.log(cliente);
    if (cliente == null) {
      return;
    }
    const buscar = DatosData.value.findIndex((r) => r._id == id);
    DatosData.value.splice(buscar, 1, cliente.data.cliente);
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
    
