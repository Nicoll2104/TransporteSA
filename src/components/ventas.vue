<template>
  <div class="contenedor_principal">
    <div class="boton_agregar">
      <q-btn label="Agregar" color="blue" @click="modal = true" />
    </div>

    <div class="contenedor_info">
      <div class="contenedor_asientos" v-if="mostrarContenedorAsientos">
        <div v-for="(asiento, index) in asientos" :key="index" @click="mostrarFormulario(asiento)">
          {{ asiento }}
          <div :class="{ 'asiento-seleccionado': asientoSeleccionado === asiento }">
            <img class="icon_img" src="https://cdn-icons-png.flaticon.com/512/566/566234.png" alt="" />
          </div>
        </div>
      </div>
      <div class="conten_clientes" v-if="mostrarFormularioClientes">
        <div class="infoDatos2">
          <div class="grupo_boton">
            <q-btn color="primary" label="Agregar clientes" @click="confirmarAgregarCliente" />
            <q-btn color="primary" label="Buscar clientes " @click="buscarCliente" />
          </div>
          <p>Numero asiento: {{ asientoSeleccionado }}</p>
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
          <q-btn color="primary" label="Confirmar" @click="crearticket()" />
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
            <q-select color="blue" filled v-model:model-value="ruta" :options="routeRutas" label="Selecciona una ruta">
              <template v-slot:prepend>
                <img src="https://cdn-icons-png.flaticon.com/128/3419/3419596.png" alt=""
                  style="height: 25px; width: 25px" />
              </template>
            </q-select>
            <br />
            <q-select color="blue" filled v-model:model-value="bus" :options="routeBuses" label="Selecciona un bus">
              <template v-slot:prepend>
                <img src="https://cdn-icons-png.flaticon.com/128/9830/9830523.png" alt=""
                  style="height: 25px; width: 25px" />
              </template>
            </q-select>
            <br />
            <div class="conten_input">
              <label for="FECHA">Fecha de venta</label>
              <div class="containerInput">
                <input placeholder="Fecha de venta" type="date"  v-model="fecha_venta" />
              </div>
            </div>
            <div class="conten_input">
              <label for="FECHA">Hora de venta</label>
              <div class="containerInput">
                <input placeholder="Fecha de venta" type="time"  v-model="hora_venta" />
              </div>
            </div>
            <div class="conten_input">
              <label for="FECHA">Fecha de salida</label>
              <div class="containerInput">
                <input placeholder="Fecha de venta" type="date" v-model="fecha_salida" />
              </div>
            </div>
            <div class="conten_input">
              <label for="FECHA">Hora de salida</label>
              <div class="containerInput">
                <input placeholder="Fecha de venta" type="time" v-model="hora_salida" />
              </div>
            </div>
            <div class="conten_input">
              <label for="FECHA">Precio</label>
              <div class="containerInput">
                <input placeholder="Fecha de venta" type="number"  v-model="Precio" />
              </div>
            </div>
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
import {useboletoStore} from '../stores/boleto.js'

const busStore = useBusStore();
const rutaStore = useRutaStore();
const clienteStore = useClienteStore();
const boletoStore = useboletoStore()

const modal = ref(false);
const selecRuta = ref(null);
const selecBus = ref(null);
const rowsBuses = ref([]);
const rowsClientes = ref([]);
const rowsRutas = ref([]);

const cedula = ref("");
const nombre = ref("");
const telefono = ref("");
const email = ref("");
const $q = useQuasar();

const fecha_venta = ref("")
const hora_venta = ref("")
const fecha_salida = ref("")
const hora_salida = ref("")
const Precio = ref(0)
const cliente = ref('')
const bus = ref('')
const ruta = ref('')

const asientoSeleccionado = ref(null);

const mostrarContenedorAsientos = ref(false);
const mostrarFormularioClientes = ref(false);


async function obtenerInformacion() {
  try {
    await busStore.obtener();
    rowsBuses.value = busStore.datosData;

    await clienteStore.obtener();
    console.log("Clientes obtenidos:", clienteStore.datosData);
    rowsClientes.value = clienteStore.datosData;

    await rutaStore.obtener();
    rowsRutas.value = rutaStore.datosData;
  } catch (error) {
    console.error("Error al obtener la información:", error);
  }
}

function mapRutas() {
  return rowsRutas.value.map((ruta) => ({
    label: `${ruta.origen} / ${ruta.destino} - ${ruta.distancia}`,
    value: ruta._id,
  }));
}

function mapBuses() {
  return rowsBuses.value.busesPopulate.map((bus) => ({
    label: `${bus.placa} / ${bus.empresa_asignada} - ${bus.numero}`,
    value: bus._id,
    n_asiento: bus.n_asiento,
    empresa_asignada: bus.empresa_asignada,
  }));
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
    $q.notify({ message: "Cliente agregado 👍", textColor: "white", type: "positive", color: "green" });
    limpiarCampos();
  } catch (error) {
    console.error("Error al agregar el cliente:", error);
    $q.notify({ type: "negative", color: "negative", message: error.response.data.error.errors[0].msg });
  }
};

const idcliente = ref('')
const buscarCliente = () => {
  const clienteEncontrado = rowsClientes.value.find(cliente => cliente.cedula === cedula.value || cliente.nombre === nombre.value);

  if (clienteEncontrado) {
    idcliente.value = clienteEncontrado._id
    cedula.value = clienteEncontrado.cedula;
    nombre.value = clienteEncontrado.nombre;
    telefono.value = clienteEncontrado.telefono;
    email.value = clienteEncontrado.email;
    $q.notify({ message: "Cliente encontrado", textColor: "white", type: "positive", color: "green" });
  } else {
    limpiarCampos();
    $q.notify({ message: "Cliente no encontrado", textColor: "white", type: "negative", color: "red" });
  }
};

const limpiarCampos = () => {
  cedula.value = "";
  nombre.value = "";
  telefono.value = "";
  email.value = "";
};

const asientos = ref([]);

function generarListaAsientos() {
  console.log(fecha_venta);
  if (bus.value !== null && bus.value !== undefined) {
    const busSeleccionado = rowsBuses.value.busesPopulate.find(
      (b) => b._id === bus.value.value
    );
    console.log("a", busSeleccionado);
    if (busSeleccionado) {
      const numeroAsientos = busSeleccionado.n_asiento;
      console.log(numeroAsientos);
      const listaAsientos = [];
      asientos.value = [];
      for (let i = 1; i <= numeroAsientos; i++) {
        asientos.value.push(Number(i));
      }
    }
  }
  modal.value = false
  mostrarContenedorAsientos.value = true;
}


function mostrarFormulario(asiento) {
  asientoSeleccionado.value = asiento;
  mostrarFormularioClientes.value = true;

}

const confirmarAgregarCliente = () => {
  agregarCliente();
};


const routeBuses = computed(() => mapBuses());
const routeRutas = computed(() => mapRutas());

const crearticket = async () => {
  const nuevoBoleto = {
    fechas: [{
      fecha_venta: fecha_venta.value,
      hora_venta: hora_venta.value,
      fecha_salida: fecha_salida.value,
      hora_salida: hora_salida.value,
    }],
    Precio: Precio.value,
    cliente: idcliente.value,
    bus: bus.value.value,
    ruta: ruta.value.value,
    vendedor: "6548481da079b612ec4a9428",
    asientos: asientoSeleccionado.value
  };
  try {
    console.log("nuevoboleto", nuevoBoleto);
    await boletoStore.agregarBoleto(nuevoBoleto);
    cliente.value = "";
    modal.value = false;
  } catch (error) {
    console.error('Error al agregar el boleto:', error);
  }
}


onMounted(() => {
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

.contenedor_asientos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  border: 1px solid #919191;
  background-color: #bbb8b856;
  border-radius: 10px;
  width: 50%;
  padding: 10px;
  justify-content: center;
}

.asiento-seleccionado {
  background-color: rgb(255, 0, 0);
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
  background-color: #ffffffad;
  border-radius: 5px;
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
</style>
