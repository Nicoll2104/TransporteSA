<template>
  <div class="q-pa-md">
    <div class="cargar_contenedor">
      <div class="title">
        <h3>Datos Clientes</h3>

        <div class="raya"></div>
      </div><br><br>

      
      <q-markup-table v-if="cargando">
      <thead>
        <tr>
          <th class="text-left" style="width: 150px">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="n in 5" :key="n">
          <td class="text-left">
            <q-skeleton animation="blink" type="text" width="85px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="50px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="35px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="65px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="25px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="85px" />
          </td>
        </tr>
      </tbody>
    </q-markup-table>

<div v-else class="contenedor_TD">
      <div class="agre"><q-btn label="Agregar" color="blue" @click="modal = true" /></div><br>

      <q-table title="DATOS CLIENTES" :rows="rows" :columns="columns" row-key="cedula">
        <template v-slot:body-cell-status="props">
          <q-td key="status" :props="props">
            <span class="color1" v-if="props.row.status == 1">Activo</span>
            <span class="color2" v-else>Inactivo</span>
          </q-td>
        </template>
        <template v-slot:body-cell-acciones="props">
          <q-td key="acciones" :props="props">
            <q-btn class="btnEditar" icon="edit" color="blue" @click="editarCliente(props.row)"></q-btn>
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
                <label class="labelDatos" for="nombre">Nombre:</label>
                <input class="inputDatos" type="text" id="nombre" v-model="nombre" />
              </div>

              <div class="ilDatos">
                <label class="labelDatos" for="telefono">Telefono:</label>
                <input class="inputDatos" type="number" id="telefono" v-model="telefono" />
              </div>

              <div class="ilDatos">
                <label class="labelDatos" for="email">Email:</label>
                <input class="inputDatos" type="text" id="email" v-model="email" />
              </div>

            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="center">
            <q-btn flat label="Cerrar" class="btn_AC" color="primary" @click="limpiar" v-close-popup />
            <q-btn flat label="Aceptar" class="btn_AC" color="primary" @click="agregarEditarCliente"
            :loading="cargando" />
          </q-card-actions>
        </q-card>
      </q-dialog>

    </div>
    </div>
  </div>
</template>
    
<script setup>
import { onMounted, ref } from "vue";
import { useClienteStore } from '../stores/clientes.js';
import { useQuasar } from 'quasar'

const clienteStore = useClienteStore()

const rows = ref([])
const modal = ref(false);
const cedula = ref("");
const nombre = ref("");
const telefono = ref("");
const email = ref("");
const clienteEditando = ref(null);
const $q = useQuasar()

const cargando = ref(false);  
const modalAbierto = ref(false);



const columns = [
  { name: "cedula", required: true, label: "Cédula", align: "center", field: "cedula", sortable: true },
  { name: "nombre", required: true, label: "Nombre", align: "center", field: "nombre", sortable: true },
  { name: "telefono", required: true, label: "Teléfono", align: "center", field: "telefono", sortable: true },
  { name: "email", required: true, label: "Email", align: "center", field: "email", sortable: true },
  { name: "status", label: "Estado", align: "center", field: "status", sortable: true },
  { name: "acciones", required: true, label: "Acciones", align: "center", field: "acciones", },
];

async function obtenerClientes() {
  try {
    cargando.value = true; 
    const clientes = await clienteStore.obtener();
    console.log('Clientes obtenidos:', clientes);
    rows.value = clienteStore.datosData;
  } catch (error) {
    console.error('Error al obtener los clientes:', error);
  } finally {
    cargando.value = false; 
  }
}


const agregarEditarCliente = async () => {
  cargando.value = true; 
  modalAbierto.value = true;

  if (clienteEditando.value) {
    const clienteEditado = {
      _id: clienteEditando.value._id,
      cedula: cedula.value,
      nombre: nombre.value,
      telefono: telefono.value,
      email: email.value,
    };
    try {
      await clienteStore.editarCliente(clienteEditado);
      cedula.value = "";
      nombre.value = "";
      telefono.value = "";
      email.value = "";
      modal.value = false;
      clienteEditando.value = null;
      $q.notify({
        message: 'Cliente editado correctamente',
        textColor: 'white',
        type: "positive",
        color: 'green',
      });
      obtenerClientes();
    } catch (error) {
      console.error('Error al editar el cliente:', error);
      $q.notify({ type: 'negative', color: 'negative', message: 'Error al editar el cliente' });
    }
  } else {
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
      $q.notify({
        message: 'Cliente agregado 👍',
        textColor: 'white',
        type: "positive",
        color: 'green',
      });
      obtenerClientes();
      limpiar();
    } catch (error) {
      console.error('Error al agregar cliente:', error);
      $q.notify({ type: 'negative', color: 'negative', message: 'Error al agregar el cleiente' });
    }
    
  }
  cargando.value = false;
  modalAbierto.value = false;
}

const editarCliente = (cliente) => {
  cedula.value = cliente.cedula;
  nombre.value = cliente.nombre;
  telefono.value = cliente.telefono;
  email.value = cliente.email;
  clienteEditando.value = cliente;
  modal.value = true;
}


async function activar(id) {
  try {
    const cliente = await clienteStore.activarCliente(id);
    obtenerClientes();
  } catch (error) {
    console.error('Error al activar cliente:', error);

  }
}

async function desactivar(id) {
  try {
    const cliente = await clienteStore.desactivarCliente(id);
    obtenerClientes();
  } catch (error) {
    console.error('Error al desactivar cliente:', error);

  }
}

const limpiar = () => {
  cedula.value = "";
  nombre.value = "";
  telefono.value = "";
  email.value = "";
};


onMounted(() => {
  obtenerClientes()
});

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

.btn_AC {
  border: 1px solid black;
}

.ilDatos {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;

}

.cargando {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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
</style>
    
