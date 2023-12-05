<template>
  <div class="q-pa-md">
    <div class="title">
      <h3>Datos Vendedores</h3>

      <div class="raya"></div>
    </div>
    <br /><br />

    <div class="agre">
      <q-btn label="Agregar" color="blue" @click="modal = true" />
    </div>
    <br /><br />

    <q-table
      title="DATOS VENDEDORES"
      :rows="rows"
      :columns="columns"
      row-key="cedula"
      class="tableRT"
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
            @click="editarVendedor(props.row)"
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
          <div class="text-h6">DATOS DE VENDEDORES</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="imagen_formulario">
            <div class="infoDatos">
              <div class="conten_input">
                <label for="CEDULA">Cedula</label>
                <div class="containerInput">
                  <input
                    placeholder="Cedula"
                    type="text"
                    id="CEDULA"
                    v-model="cedula"
                    autocomplete="on"
                  />
                </div>
                <span class="error">{{ errorCedula }}</span>
              </div>
              <br />
              <div class="conten_input">
                <label for="NOMBRE">Nombre</label>
                <div class="containerInput">
                  <input
                    placeholder="Nombre"
                    type="text"
                    id="NOMBRE"
                    v-model="nombre"
                    autocomplete="on"
                  />
                </div>
                <span class="error">{{ errorNombre }}</span>
              </div>
              <br />
              <div class="conten_input">
                <label for="APELLIDO">Apellido</label>
                <div class="containerInput">
                  <input
                    placeholder="Apellido"
                    type="text"
                    id="APELLIDO"
                    v-model="apellido"
                    autocomplete="on"
                  />
                </div>
                <span class="error">{{ errorApellido }}</span>
              </div>
              <br />
              <div class="conten_input">
                <label for="TELEFONO">Telefono</label>
                <div class="containerInput">
                  <input
                    placeholder="Telefono"
                    type="number"
                    id="TELEFONO"
                    v-model="telefono"
                    autocomplete="on"
                  />   
                </div>
                <span class="error">{{ errorTelefono }}</span>
              </div>
              <br />
              <div class="conten_input">
                <label for="USUARIO">Usuario</label>
                <div class="containerInput">
                  <input
                    placeholder="Usuario"
                    type="text"
                    id="USUARIO"
                    v-model="usuario"
                    autocomplete="on"
                  />
                </div>
                <span class="error">{{ errorUsuario }}</span>
              </div>
              <br />
              <div class="conten_input">
                <label for="CONTRASENA">Contraseña</label>
                <div class="containerInput">
                  <input
                    placeholder="Password"
                    type="text"
                    id="CONTRASENA"
                    v-model="contrasena"
                    autocomplete="on"
                  />
                </div>
                <span class="error">{{ errorContrasena }}</span>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cerrar"
            color="white"
            @click="limpiar"
            class="btnc"
            v-close-popup
          />
          <q-btn
            flat
            label="Aceptar"
            color="white"
            @click="agregarEditarVendedor"
            class="btna"
            :loading="cargando"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
    
<script setup>
import { onMounted, ref } from "vue";
import { useVendedorStore } from "../stores/vendedor.js";
import { useQuasar } from "quasar";

const vendedorStore = useVendedorStore();

const modal = ref(false);
const rows = ref([]);
const nombre = ref("");
const apellido = ref("");
const cedula = ref("");
const telefono = ref("");
const usuario = ref("");
const contrasena = ref("");
const vendedorEditando = ref(null);
const $q = useQuasar();

const cargando = ref(false);
const modalAbierto = ref(false);

const columns = [
  {
    name: "cedula",
    required: true,
    label: "Cedula",
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
    name: "apellido",
    required: true,
    label: "Apellido",
    align: "center",
    field: "apellido",
    sortable: true,
  },
  {
    name: "telefono",
    required: true,
    label: "Telefono",
    align: "center",
    field: "telefono",
    sortable: true,
  },
  {
    name: "usuario",
    required: true,
    label: "Usuario",
    align: "center",
    field: "usuario",
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

async function obtenerVendedor() {
  try {
    const Vendedores = await vendedorStore.obtener();
    console.log("Vendedores obtenidos:", Vendedores);
    rows.value = vendedorStore.datosData.reverse();
  } catch (error) {
    console.error("Error al obtener los Vendedores:", error);
  }
}

const errorCedula = ref("");
const errorNombre = ref("");
const errorApellido = ref("");
const errorTelefono = ref("");
const errorUsuario = ref("");
const errorContrasena = ref("");

const agregarEditarVendedor = async () => {

  if (!cedula.value) {
    errorCedula.value = "Por favor, ingresa el número de cédula";
    clearErrors();
    console.log("Error de cédula");
    return;
  }

  if (!nombre.value) {
    errorNombre.value = "Por favor, ingresa tu nombre";
    clearErrors();
    console.log("Error de nombre");
    return;
  }

  if (!apellido.value) {
    errorApellido.value = "Por favor, ingresa el apellido";
    clearErrors();
    console.log("Error de apellido");
    return;
  }

  if (!telefono.value) {
    errorTelefono.value = "Por favor, ingresa el número de teléfono";
    clearErrors();
    console.log("Error de teléfono");
    return;
  }

  if (!usuario.value) {
    errorUsuario.value = "Por favor, ingresa un usuario";
    clearErrors();
    console.log("Error de usuario");
    return;
  }

  if (!contrasena.value) {
    errorContrasena.value = "Por favor, ingresa tu contraseña";
    clearErrors();
    console.log("Error de contraseña");
    return;
  }

  if (vendedorEditando.value) {
    const vendedorEditado = {
      _id: vendedorEditando.value._id,
      cedula: cedula.value,
      nombre: nombre.value,
      apellido: apellido.value,
      telefono: telefono.value,
      usuario: usuario.value,
      contrasena: contrasena.value,
    };
    try {
      await vendedorStore.editarVendedor(vendedorEditado);
      cedula.value = "";
      nombre.value = "";
      apellido.value = "";
      telefono.value = "";
      usuario.value = "";
      contrasena.value = "";
      modal.value = false;
      vendedorEditando.value = null;
      $q.notify({
        message: "Vendedor editado correctamente",
        textColor: "white",
        type: "positive",
        color: "green",
      });
      obtenerVendedor();
    } catch (error) {
      console.error("Error al editar el vendedor:", error);
      $q.notify({
        type: "negative",
        color: "negative",
        message: error.response.data.error,
      });
    }
  } else {
    const nuevoVendedor = {
      cedula: cedula.value,
      nombre: nombre.value,
      apellido: apellido.value,
      telefono: telefono.value,
      usuario: usuario.value,
      contrasena: contrasena.value,
    };
    try {
      await vendedorStore.agregarVendedor(nuevoVendedor);
      cedula.value = "";
      nombre.value = "";
      apellido.value = "";
      telefono.value = "";
      usuario.value = "";
      contrasena.value = "";
      modal.value = false;
      $q.notify({
        message: "Vendedor agregado correctamente",
        textColor: "white",
        type: "positive",
        color: "green",
      });
      obtenerVendedor();
      limpiar();
    } catch (error) {
      console.error("Error al agregar el vendedor:", error);
      $q.notify({
        type: "negative",
        color: "negative",
        message: error.response.data.error.errors[0].msg,
      });
    }
  }
  cargando.value = false;
  modalAbierto.value = false;
};

const editarVendedor = (vendedor) => {
  cedula.value = vendedor.cedula;
  nombre.value = vendedor.nombre;
  apellido.value = vendedor.apellido;
  telefono.value = vendedor.telefono;
  usuario.value = vendedor.usuario;
  contrasena.value = vendedor.contrasena;
  vendedorEditando.value = vendedor;
  modal.value = true;
  $q.notify({
    message: `Editando al vendedor ${vendedor.nombre}`,
    textColor: "white",
    icon: "edit",
    color: "info",
  });
};


const clearErrors = () => {
  setTimeout(()=>{
  errorCedula.value = "";
  errorNombre.value = "";
  errorApellido.value = "";
  errorTelefono.value = "";
  errorUsuario.value = "";
  errorContrasena.value = "";
},4000);
};

const limpiar = () => {
  cedula.value = "";
  nombre.value = "";
  apellido.value = "";
  telefono.value = "";
  usuario.value = "";
  contrasena.value = "";
};

async function activar(id) {
  try {
    const vendedor = await vendedorStore.activarVendedor(id);
    console.log("vendedor activado:", vendedor);
    obtenerVendedor();
  } catch (error) {
    console.error("Error al activar vendedor:", error);
  }
}

async function desactivar(id) {
  try {
    const vendedor = await vendedorStore.desactivarVendedor(id);
    console.log("vendedor desactivado:", vendedor);
    obtenerVendedor();
  } catch (error) {
    console.error("Error al desactivar vendedor:", error);
  }
}

onMounted(() => {
  obtenerVendedor();
});
</script>
    
<style scoped>
.btna {
  background-color: #1976d2;
}

.btnc {
  background-color: rgb(210, 25, 25);
}
.btnEditar {
  margin: 5px;
}

.color1 {
  color: #51ff00;
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
  background-image: conic-gradient(
    from 0deg at 50% 50%,
    #073aff00 0%,
    rgb(28, 49, 235) 25%,
    #073aff00 25%
  );
}

.containerInput > input {
  width: 100%;
  height: 35px;
  font-size: inherit;
  border: none;
  padding: 12px;
  background-color: #ffffff;

}

.containerInput > input:focus {
  outline: none;
}

.containerInput > input:not(:placeholder-shown) {
  outline: none;
}

.containerInput > input:not(:placeholder-shown):valid {
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
  background: linear-gradient(
    90deg,
    #1976d2,
    #1976d2,
    #1976d2,
    #1976d2,
    #50a3f7
  );
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