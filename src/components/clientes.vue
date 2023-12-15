<template>
  <div class="q-pa-md">
    <div class="cargar_contenedor">
      <div class="title">
        <h3>Datos Clientes</h3>
      </div>

      <div class="spinner-container" v-if="cargando">
        <q-spinner-hourglass size="100px" color="primary" />
        <p class="p-carga">Cargando...</p>
      </div>

      <div class="contenedor_TD" v-else>
        <div class="raya"></div>
        <br />
        <div class="agre">
          <q-btn label="Agregar" color="blue" @click="modal = true" />
        </div>
        <br />
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
        <q-dialog v-model="modal" no-backdrop-dismiss>
          <q-card class="conten_modal">
            <q-card-section class="arri">
              <div class="text-h6">DATOS DE CLIENTE
                <q-btn flat class="btn_A1" label="❌" color="white" @click="limpiar" v-close-popup />
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <div class="infoDatos">
                <div class="conten_input">
                  <label for="CEDULA">Cedula</label>
                  <div class="containerInput">
                    <input placeholder="Cedula" type="text" id="CEDULA" v-model="cedula" autocomplete="on" />
                  </div>
                  <span class="error">{{ errorCedula }}</span>
                </div>
                <br />
                <div class="conten_input">
                  <label for="NOMBRE">Nombre</label>
                  <div class="containerInput">
                    <input placeholder="Nombre" type="text" id="NOMBRE" v-model="nombre" autocomplete="on" />
                  </div>
                  <span class="error">{{ errorNombre }}</span>
                </div>
                <br />
                <div class="conten_input">
                  <label for="TELEFONO">Telefono</label>
                  <div class="containerInput">
                    <input placeholder="Telefono" type="number" id="TELEFONO" v-model="telefono" autocomplete="on" />
                  </div>
                  <span class="error">{{ errorTelefono }}</span>
                </div>
                <br />
                <div class="conten_input">
                  <label for="EMAIL">Email</label>
                  <div class="containerInput">
                    <input placeholder="Gmail" type="email" id="EMAIL" v-model="email" autocomplete="on" />
                  </div>
                  <span class="error">{{ errorEmail }}</span>
                </div>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-actions align="right">
              <q-btn flat label="Cerrar" class="btnc" @click="limpiar" color="white" v-close-popup />
              <q-btn flat label="Aceptar" class="btna" color="white" @click="agregarEditarCliente" :loading="load" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useClienteStore } from "../stores/clientes.js";
import { useQuasar } from "quasar";

const clienteStore = useClienteStore();

const rows = ref([]);
const modal = ref(false);
const cedula = ref("");
const nombre = ref("");
const telefono = ref("");
const email = ref("");
const clienteEditando = ref(null);
const $q = useQuasar();
const errorCedula = ref("");
const errorNombre = ref("");
const errorTelefono = ref("");
const errorEmail = ref("");
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
    name: "telefono",
    required: true,
    label: "Teléfono",
    align: "center",
    field: "telefono",
    sortable: true,
  },
  {
    name: "email",
    required: true,
    label: "Email",
    align: "center",
    field: "email",
    sortable: true,
  },
  {
    name: "status",
    label: "Estado",
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

async function obtenerClientes() {
  try {
    cargando.value = true;
    const clientes = await clienteStore.obtener();
    console.log("Clientes obtenidos:", clientes);
    rows.value = clienteStore.datosData.reverse();
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
  } finally {
    cargando.value = false;
  }
}

const agregarEditarCliente = async () => {
  cargando.value = true;
  modalAbierto.value = true;

  try {
    errorCedula.value = "";
    errorNombre.value = "";
    errorTelefono.value = "";
    errorEmail.value = "";

    if (!cedula.value) {
      errorCedula.value = "Por favor, ingresar el número de cédula";
      clearErrors();
      return;
    }

    if (!nombre.value.trim()) {
      errorNombre.value = "Por favor, ingrese su nombre";
      clearErrors();
      return;
    }

    if (!telefono.value) {
      errorTelefono.value = "Por favor, ingresar el número de teléfono";
      clearErrors();
      return;
    }

    if (!email.value.trim()) {
      errorEmail.value = "Por favor, ingresar el correo";
      clearErrors();
      return;
    }

    if (clienteEditando.value) {
      const clienteEditado = {
        _id: clienteEditando.value._id,
        cedula: cedula.value,
        nombre: nombre.value,
        telefono: telefono.value,
        email: email.value,
      };
      load.value = true
      await clienteStore.editarCliente(clienteEditado);
      load.value = false
      $q.notify({
        message: "Cliente actualizado correctamente",
        textColor: "white",
        type: "positive",
        color: "green",
      });
      obtenerClientes();
    } else {
      const nuevoCliente = {
        cedula: cedula.value,
        nombre: nombre.value,
        telefono: telefono.value,
        email: email.value,
      };
      load.value = true
      await clienteStore.agregarCliente(nuevoCliente);
      load.value = false
      $q.notify({
        message: "Cliente agregado 👍",
        textColor: "white",
        type: "positive",
        color: "green",
      });
      obtenerClientes();
      limpiar();
    }
  } catch (error) {
    load.value = false
    console.error("Error en la función agregarEditarCliente:", error);

    if (
      error.response &&
      error.response.data &&
      error.response.data.error &&
      error.response.data.error.errors &&
      error.response.data.error.errors.length > 0
    ) {
      $q.notify({
        type: "negative",
        color: "negative",
        message: error.response.data.error.errors[0].msg,
      });
    } else if (
      error.response &&
      error.response.data &&
      error.response.data.error
    ) {
      $q.notify({
        type: "negative",
        color: "negative",
        message: error.response.data.error,
      });
    } else {
      $q.notify({
        type: "negative",
        color: "negative",
        message: "Error en la operación",
      });
    }
    load.value = false
    console.error("Error en la función de editarCliente:", error);
  } finally {
    cargando.value = false;
    modalAbierto.value = false;
  }
};

const editarCliente = (cliente) => {
  cedula.value = cliente.cedula;
  nombre.value = cliente.nombre;
  telefono.value = cliente.telefono;
  email.value = cliente.email;
  clienteEditando.value = cliente;
  modal.value = true;
  $q.notify({
    message: `Editando al cliente ${cliente.nombre}`,
    textColor: "blue",
    icon: "edit",
    color: "white",
  });
};

async function activar(id) {
  try {
    const cliente = await clienteStore.activarCliente(id);
  } catch (error) {
    console.error("Error al activar cliente:", error);
  }
  obtenerClientes();
}

async function desactivar(id) {
  try {
    const cliente = await clienteStore.desactivarCliente(id);
  } catch (error) {
    console.error("Error al desactivar cliente:", error);
  }
  obtenerClientes();
}

const limpiar = () => {
  cedula.value = "";
  nombre.value = "";
  telefono.value = "";
  email.value = "";
  clearErrors();
};

const clearErrors = () => {
  setTimeout(() => {
    errorCedula.value = "";
    errorNombre.value = "";
    errorTelefono.value = "";
    errorEmail.value = "";
  }, 4000);
};

onMounted(() => {
  obtenerClientes();
});
</script>

<style scoped>
.btna {
  background-color: #1976d2;
}

.btnc {
  background-color: rgb(210, 25, 25);
}

.color1 {
  color: #51ff00;
}

.color2 {
  color: #f50a0a;
}

.btn_A1 {
  position: relative;
  left: 80%;
}

.text-h6 {
  display: flex;
  align-items: center;
}

.p-carga {
  position: relative;
  bottom: 85px;
  font-size: 20px;
  font-weight: 600;
}

.conten_modal {
  width: 100%;
  background-image: url("../assets/logo.PNG");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  max-width: 630px;
  margin: 0 auto;
}

.spinner-container {
  display: grid;
  margin: 0%;
  justify-content: center;
  align-items: center;
  height: 50vh;
}

.btnEditar {
  margin: 5px;
}

.agre {
  display: flex;
  justify-content: flex-end;
}

.infoDatos {
  width: 50%;
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
  background-color: #f50a0a;
  background: linear-gradient(90deg,
      #1976d2,
      #1976d2,
      #1976d2,
      #1976d2,
      #50a3f7);
  color: #ffffff;
  width: 100%;
}

.error {
  color: red;
}
</style>
