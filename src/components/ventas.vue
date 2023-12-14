<template>
  <div class="contenedor_principal">
    <div class="boton_agregar" v-if="mostrarBotonAgregar">
      <q-btn label="Agregar" color="blue" @click="modal = true" />
    </div>
    <q-btn color="primary" class="btn_info" icon="keyboard_arrow_down" label="Datos" v-if="mostrarContenedorAsientos">
      <q-menu transition-show="flip-right" transition-hide="flip-left">
        <q-list style="min-width: 100px">
          <q-item clickable>
            <q-item-section>
              <p class="menu_n">Ruta:</p>{{ obtenerNombreRuta(ruta) }}
            </q-item-section>
          </q-item>
          <q-item clickable>
            <q-item-section>
              <p class="menu_n">Bus:</p> {{ obtenerInfoBus(bus) }}
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item clickable>
            <div class="conten_menu">
              <p class="menu_n">Asiento seleccionado</p>
              <q-item-section>
                <p class="menu1">{{ asientoSeleccionado }}</p>
              </q-item-section>
            </div>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <br>
    <br>

    <div class="contenedor_info">
      <div class="contenedor_asientos" v-if="mostrarContenedorAsientos">
        <div v-for="(asiento, index) in asientos" :key="index" @click="mostrarFormulario(asiento)">
          {{ asiento }}
          <div :class="{ 'asiento-seleccionado': asientoSeleccionado === asiento }">
            <img class="icon_img" src="../assets/ii.png" alt="" />
          </div>
        </div>
      </div>
      <div class="conten_clientes" v-if="mostrarFormularioClientes">
        <div class="infoDatos2">
          <div class="grupo_boton">
            <q-btn color="primary" label="Agregar clientes" @click="confirmarAgregarCliente" />
            <q-btn color="primary" label="Buscar clientes " @click="buscarCliente" />
          </div>
          <br>
          <div class="conten_input">
            <label for="CEDULA">Cedula</label>
            <div class="containerInput">
              <input placeholder="Cedula" type="text" v-model="cedula" id="CEDULA" autocomplete="on" />
            </div>
          </div>
          <br />
          <div class="conten_input">
            <label for="NOMBRE">Nombre</label>
            <div class="containerInput">
              <input placeholder="Nombre" type="text" id="NOMBRE" v-model="nombre" autocomplete="on" />
            </div>
          </div>
          <br />
          <div class="conten_input">
            <label for="TELEFONO">Telefono</label>
            <div class="containerInput">
              <input placeholder="Telefono" type="number" id="TELEFONO" v-model="telefono" autocomplete="on" />
            </div>
          </div>
          <br />
          <div class="conten_input">
            <label for="EMAIL">Email</label>
            <div class="containerInput">
              <input placeholder="Gmail" type="email" id="EMAIL" v-model="email" autocomplete="on" />
            </div>
          </div>
          <br>
          <div class="conten_input">
            <label for="PRECIO">Precio</label>
            <div class="containerInput">
              <input placeholder="Precio" type="number" id="PRECIO" v-model="Precio" required />
            </div>
            <span class="error">{{ errorPrecio }}</span>
          </div>

          <div class="botones">
            <q-btn color="primary" label="Confirmar" @click="crearticket()" />
            <q-btn color="primary" label="Limpiar" @click="limpiarTodo" />
          </div>

        </div>
      </div>
    </div>
    <q-dialog v-model="modal">
      <q-card class="conten_modal">
        <q-card-section class="arri">
          <div class="text-h6">Ventas de Tickets</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="infoDatos">
            <label for="">Rutas</label>
            <q-select color="blue" filled v-model="ruta" :options="routeRutas" label="Selecciona una ruta">
              <template v-slot:prepend>
                <img src="https://cdn-icons-png.flaticon.com/128/3419/3419596.png" alt=""
                  style="height: 25px; width: 25px" />
              </template>
            </q-select>
            <span class="error">{{ errorRutas }}</span>
            <br>
            <label for="">Buses</label>
            <q-select color="blue" filled v-model="bus" :options="routeBuses" label="Selecciona un bus">
              <template v-slot:prepend>
                <img src="https://cdn-icons-png.flaticon.com/128/9830/9830523.png" alt=""
                  style="height: 25px; width: 25px" />
              </template>
            </q-select>
            <span class="error">{{ errorBuses }}</span>
            <br>
            <div class="conten_input">
              <label for="FECHA">Fecha de salida</label>
              <div class="containerInput">
                <input placeholder="Fecha de salida" type="date" id="FECHA" v-model="fecha_salida" required />
              </div>
            </div>
            <br />

            <br />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="center">
          <q-btn flat label="Cerrar" class="btnc" color="white" v-close-popup />
          <q-btn flat label="Aceptar" class="btna" color="white" @click="generarListaAsientos()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useQuasar } from "quasar";
import { useRutaStore } from "../stores/ruta.js";
import { useBusStore } from "../stores/bus.js";
import { useClienteStore } from "../stores/clientes.js";
import { useboletoStore } from "../stores/boleto.js";

const busStore = useBusStore();
const rutaStore = useRutaStore();
const clienteStore = useClienteStore();
const boletoStore = useboletoStore();

const modal = ref(false);
const rowsBuses = ref([]);
const rowsClientes = ref([]);
const rowsRutas = ref([]);

const cedula = ref("");
const nombre = ref("");
const telefono = ref("");
const email = ref("");
const idcliente = ref("");
const $q = useQuasar();


let asientos = ref([]);
let fecha_venta = ref("");
let hora_venta = ref("");
let fecha_salida = ref("");
let Precio = ref("");
let cliente = ref("");
let bus = ref("");
let ruta = ref("");
let errorRutas = ref("");
let errorBuses = ref("");
let errorPrecio = ref("");

const asientoSeleccionado = ref(null);
const mostrarBotonAgregar = ref(true);
const mostrarContenedorAsientos = ref(false);
const mostrarFormularioClientes = ref(false);

async function obtenerInformacion() {
  try {
    await busStore.obtener();
    rowsBuses.value = busStore.datosData;

    await clienteStore.obtener();
    rowsClientes.value = clienteStore.datosData;

    await rutaStore.obtener();
    rowsRutas.value = rutaStore.datosData;
    console.log(rutaStore.datosData);
  } catch (error) {
    console.error("Error al obtener la información:", error);
  }
}


function mapRutas() {
  const rutasActivas = rowsRutas.value.filter(ruta => ruta.status === 1);
  return rutasActivas.map((ruta) => ({
    label: `${ruta.origen} / ${ruta.destino} - ${formatoHora(ruta.horarios)}`,
    value: ruta._id,
  }));
}


function mapBuses() {
  if (rowsBuses.value && Array.isArray(rowsBuses.value.busesPopulate)) {
    const busesActivos = rowsBuses.value.busesPopulate.filter(bus => bus.status === 1);
    return busesActivos.map((bus) => ({
      label: `${bus.placa} / ${bus.empresa_asignada} - ${bus.numero}`,
      value: bus._id,
      n_asiento: bus.n_asiento,
      empresa_asignada: bus.empresa_asignada,
    }));
  } else {
    return [];
  }
}


const agregarCliente = async () => {
  try {
    await clienteStore.agregarCliente({
      cedula: cedula.value,
      nombre: nombre.value,
      telefono: telefono.value,
      email: email.value,
    });
    console.log("Cliente agregado exitosamente");
    $q.notify({
      message: "Cliente agregado 👍",
      textColor: "white",
      type: "positive",
      color: "green",
    });
    limpiarCampos();
  } catch (error) {
    console.error("Error al agregar el cliente:", error);
    $q.notify({
      type: "negative",
      color: "negative",
      message: error.response.data.error.errors[0].msg,
    });
  }
};

function formatoHora(hora24) {
  const horaParsed = new Date(`1970-01-01T${hora24}:00`);
  return horaParsed.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
}

const buscarCliente = () => {
  const clienteEncontrado = rowsClientes.value.find(
    (cliente) =>
      cliente.cedula === cedula.value || cliente.nombre === nombre.value
  );

  if (clienteEncontrado) {
    idcliente.value = clienteEncontrado._id;
    cedula.value = clienteEncontrado.cedula;
    nombre.value = clienteEncontrado.nombre;
    telefono.value = clienteEncontrado.telefono;
    email.value = clienteEncontrado.email;
    $q.notify({
      message: "Cliente encontrado",
      textColor: "white",
      type: "positive",
      color: "green",
    });
  } else {
    limpiarCampos();
    $q.notify({
      message: "Cliente no encontrado",
      textColor: "white",
      type: "negative",
      color: "red",
    });
  }
};


const validarCampos = () => {
  let errores = false;

  if (!ruta.value) {
    errorRutas.value = "Por favor, selecciona una ruta";
    ocultarMensajeDeError("errorRutas");
    errores = true;
  } else {
    errorRutas.value = "";
  }

  if (!bus.value) {
    errorBuses.value = "Por favor, selecciona un bus";
    ocultarMensajeDeError("errorBuses");
    errores = true;
  } else {
    errorBuses.value = "";
  }

  return !errores;
};

const ocultarMensajeDeError = (campo) => {
  setTimeout(() => {
    if (campo === "errorRutas") {
      errorRutas.value = "";
      errorBuses.value = "";
      errorPrecio.value = "";
    }
  }, 4000);
};


function generarListaAsientos() {
  const camposValidos = validarCampos();

  if (camposValidos) {
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    const formattedTime = formatAMPM(now);
    fecha_venta.value = formattedDate;
    hora_venta.value = formattedTime;

    if (bus.value !== null && bus.value !== undefined) {
      const busSeleccionado = rowsBuses.value.busesPopulate.find(
        (b) => b._id === bus.value.value
      );
      if (busSeleccionado) {
        const numeroAsientos = busSeleccionado.n_asiento;
        asientos.value = [];
        for (let i = 1; i <= numeroAsientos; i++) {
          asientos.value.push(Number(i));
        }
      }
    }
    if (ruta.value && bus.value) {
      mostrarBotonAgregar.value = false;
    }

    modal.value = false;
    mostrarContenedorAsientos.value = true;
  }
}


const obtenerNombreRuta = (rutaSeleccionada) => {
  if (rutaSeleccionada) {
    const rutaEncontrada = rowsRutas.value.find(ruta => ruta._id === rutaSeleccionada.value);
    if (rutaEncontrada) {
      return `${rutaEncontrada.origen} / ${rutaEncontrada.destino} / ${formatoHora(rutaEncontrada.horarios)}`;
    }
  }
  return 'Ruta no seleccionada';
};

const obtenerInfoBus = (busSeleccionado) => {
  if (busSeleccionado) {
    const busEncontrado = rowsBuses.value.busesPopulate.find(bus => bus._id === busSeleccionado.value);
    if (busEncontrado) {
      return `${busEncontrado.placa} / ${busEncontrado.empresa_asignada} / ${busEncontrado.numero}`;
    }
  }
  return 'Bus no seleccionado';
};

function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  const strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

function mostrarFormulario(asiento) {
  asientoSeleccionado.value = asiento;
  mostrarFormularioClientes.value = true;
}

const crearticket = async () => {
  const clienteEncontrado = rowsClientes.value.find((cliente) => cliente._id === idcliente.value);
  if (!clienteEncontrado || clienteEncontrado.status == 0) {
    $q.notify({
      type: "negative",
      color: "negative",
      message: "No se puede vender un boleto a un cliente inactivo.",
    });
    return;
  }
  const nuevoBoleto = {
    fechas: [
      {
        fecha_venta: fecha_venta.value,
        hora_venta: hora_venta.value,
        fecha_salida: fecha_salida.value,
      },
    ],
    Precio: Precio.value,
    cliente: idcliente.value,
    bus: bus.value.value,
    ruta: ruta.value.value,
    vendedor: localStorage.getItem("vendedor"),
    asientos: asientoSeleccionado.value,
  };
  try {
    if (Precio.value <= 0) {
      errorPrecio.value = "Por favor, ingrese un precio válido mayor que 0";
      ocultarMensajeDeError("errorPrecio");
      return
    } else {
      errorPrecio.value = "";
    }
    console.log("nuevoboleto", nuevoBoleto);
    await boletoStore.agregarBoleto(nuevoBoleto);
    cliente.value = "";
    modal.value = false;
    $q.notify({ message: "Boleto de cliente creado", textColor: "white", type: "positive", color: "green" });
  } catch (error) {
    $q.notify({
      type: "negative",
      color: "negative",
      message: error.response.data.error,
    });
  }
};

const limpiarTodo = () => {
  cedula.value = "";
  nombre.value = "";
  telefono.value = "";
  email.value = "";
};

const limpiarCampos = () => {
  cedula.value = "";
  nombre.value = "";
  telefono.value = "";
  email.value = "";
};

const confirmarAgregarCliente = () => {
  agregarCliente();
};

const routeBuses = computed(() => mapBuses());
const routeRutas = computed(() => mapRutas());

onMounted(() => {
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();


  month = month < 10 ? `0${month}` : month;
  day = day < 10 ? `0${day}` : day;

  fecha_salida.value = `${year}-${month}-${day}`;
  obtenerInformacion();
});
</script>

<style scoped>
.conten_modal {
  width: 100%;
  background-image: url("../assets/logo.PNG");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  max-width: 630px;
  margin: 0 auto;
}

.btna {
  background-color: #1976d2;
}

.infoDatos {
  width: 50%;
}

.infoDatos2 {
  width: 100%;
}

.error {
  position: relative;
  left: 10px;
  color: #f50a0a;
}

.contenedor_info {
  display: flex;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
}

.conten_clientes {
  box-sizing: border-box;
  width: 50%;
  padding: 10px;
}

@media screen and (max-width: 600px) {
  .conten_clientes {
    width: 70%;
    margin: 5px auto;
  }
}

.grupo_boton {
  display: flex;
  justify-content: space-between;
}

.conten_menu {
  display: grid;
  align-items: center;
  justify-content: center;
  justify-items: center;

}

.menu1 {
  font-size: 40px;
  font-weight: 600;
}

.menu_n {
  display: flex;
  font-size: 17px;
  font-weight: 700;
}

.contenedor_asientos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  border: 1px solid #919191;
  background-color: #bbb8b856;
  border-radius: 10px;
  width: 50%;
  padding: 6px;
  justify-content: center;
}



.asiento-seleccionado {
  background-color: rgb(255, 187, 0);
  border-radius: 5px;
}

.contenedor_asientos div {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon_img {
  width: 40px;
  cursor: pointer;
  border: 1px solid black;
  border-radius: 5px;
}

.btn_info{
  display: flex;
  margin-left: 88%;
}

.boton_agregar {
  display: flex;
  justify-content: center;
  margin: 10px;
}

.btnc {
  background-color: rgb(210, 25, 25);
}

.containerInput {
  background-color: #000000;
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
  height: 45px;
  font-size: inherit;
  border: none;
  padding: 12px;
  background-color: rgb(238, 236, 236);
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

.botones {
  display: flex;
  justify-content: center;
  gap: 25px;
  margin: 40px;
}

.mensaje-error {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}</style>
