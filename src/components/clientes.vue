<template>
  <div class="q-pa-md">
    <q-table title="DATOS CLIENTES" :rows="rows" :columns="columns" row-key="cedula">
      <template v-slot:body-cell-status="props">
        <q-td key="status" :props="props">
          <span class="color1" v-if="props.row.status == 1">Activo</span>
          <span class="color2" v-else>Inactivo</span>
        </q-td>
      </template>
      <template v-slot:body-cell-acciones="props">
        <q-td key="acciones" :props="props">
          <q-btn class="btnEditar" icon="edit" color="amber" @click="EditarCliente(props.row)"></q-btn>
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
              <label class="labelDatos" for="cedula">Cedula:</label>
              <input class="inputDatos" type="text" id="cedula" v-model="cedula" />
            </div>

            <div class="ilDatos">
              <label class="labelDatos" for="telefono">Nombre:</label>
              <input class="inputDatos" type="text" id="nombre" v-model="nombre" />
            </div>

            <div class="ilDatos">
              <label class="labelDatos" for="telefono">Telefono:</label>
              <input class="inputDatos" type="text" id="telefono" v-model="telefono" />
            </div>

            <div class="ilDatos">
              <label class="labelDatos" for="email">Email:</label>
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
import { onMounted, ref } from "vue";
import { useClienteStore } from '../stores/clientes.js';

const clienteStore = useClienteStore()

const rows = ref([])
const modal = ref(false);
const cedula = ref("");
const nombre = ref("");
const telefono = ref("");
const email = ref("");

async function obtenerClientes() {
  try {
    const clientes = await clienteStore.obtener();
    console.log('Clientes obtenidos:', clientes); 
    rows.value = clienteStore.datosData;
  } catch (error) {
    console.error('Error al obtener los clientes:', error);
  }
}


async function AgregarCliente() {
  const nuevoCliente = {
    cedula: cedula.value,
    nombre: nombre.value,
    telefono: telefono.value,
    email: email.value,
  };

  try {
    await clienteStore.agregarCliente(nuevoCliente);

    cedula.value = "";
    nombre.value = "";
    telefono.value = "";
    email.value = "";

    modal.value = false;

    obtenerClientes();
  } catch (error) {
    console.error('Error al agregar cliente:', error);
  }
}


async function activar(id) {
  try {
    const cliente = await clienteStore.activarCliente(id); 
    console.log('Cliente activado:', cliente);
    obtenerClientes();
  } catch (error) {
    console.error('Error al activar cliente:', error);
  }
}

async function desactivar(id) {
  try {
    const cliente = await clienteStore.desactivarCliente(id);
    console.log('Cliente desactivado:', cliente);
    obtenerClientes();
  } catch (error) {
    console.error('Error al desactivar cliente:', error);
  }
}


onMounted(() => {
  obtenerClientes()
});


const columns = [
  { name: "cedula", required: true, label: "Cédula", align: "left", field: "cedula", sortable: true },
  { name: "nombre", required: true, label: "Nombre", align: "left", field: "nombre", sortable: true },
  { name: "telefono", required: true, label: "Teléfono", align: "left", field: "telefono", sortable: true },
  { name: "email", required: true, label: "Email", align: "left", field: "email", sortable: true },
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

.btnEditar{
  margin: 5px;
}


label {
  margin-right: 20px;
}

</style>
    
