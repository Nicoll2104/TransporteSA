<template>
  <div class="q-pa-md">
    <div class="cargando">
      <q-spinner-ios v-if="loading" color="primary" size="100px" />
    </div>
    <div class="cargar_contenedor" v-if="dataLoaded">
      <div class="title">
        <h3>Datos Tickets</h3>

        <div class="raya"></div>
      </div><br><br>

      <div class="agre"><q-btn label="Agregar" color="blue" @click="modal = true" /></div><br><br>

      <q-table title="DATOS TICKETS" :rows="rows" :columns="columns" row-key="fecha_venta" class="tableRT">
        <template v-slot:body-cell-status="props">
          <q-td key="status" :props="props">
            <span class="color1" v-if="props.row.status == 1">Activo</span>
            <span class="color2" v-else>Inactivo</span>
          </q-td>
        </template>
        <template v-slot:body-cell-acciones="props">
          <q-td key="acciones" :props="props">
            <q-btn class="btnEditar" icon="edit" color="primary" @click="editarBoleto(props.row)"></q-btn>
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
                <label class="labelDatos" for="fecha_venta">Fecha_Venta:</label>
                <input class="inputDatos" type="text" id="fecha_venta" v-model="fecha_venta" />
              </div>

              <div class="ilDatos">
                <label class="labelDatos" for="hora_venta">Hora_Venta:</label>
                <input class="inputDatos" type="text" id="hora_venta" v-model="hora_venta" />
              </div>

              <div class="ilDatos">
                <label class="labelDatos" for="fecha_salida"> Fecha_Salida:</label>
                <input class="inputDatos" type="text" id="fecha_salida" v-model="fecha_salida" />
              </div>

              <div class="ilDatos">
                <label class="labelDatos" for="hora_salida">Hora_Salida:</label>
                <input class="inputDatos" type="text" id="hora_salida" v-model="hora_salida" />
              </div>

              <div class="ilDatos">
                <label class="labelDatos" for="Precio">Precio:</label>
                <input class="inputDatos" type="text" id="Precio" v-model="Precio" />
              </div>

              <div class="ilDatos">
                <label class="labelDatos" for="cliente">Cliente:</label>
                <input class="inputDatos" type="text" id="cliente" v-model="cliente" />
              </div>

              <div class="ilDatos">
                <label class="labelDatos" for="bus">Bus:</label>
                <input class="inputDatos" type="text" id="bus" v-model="bus" />
              </div>

              <div class="ilDatos">
                <label class="labelDatos" for="ruta">Ruta:</label>
                <input class="inputDatos" type="text" id="ruta" v-model="ruta" />
              </div>

              <div class="ilDatos">
                <label class="labelDatos" for="conductor">Conductor:</label>
                <input class="inputDatos" type="text" id="conductor" v-model="conductor" />
              </div>

              <div class="ilDatos">
                <label class="labelDatos" for="vendedor">Vendedor:</label>
                <input class="inputDatos" type="text" id="vendedor" v-model="vendedor" />
              </div>

            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="center">
            <q-btn flat label="Cerrar" color="primary" @click="limpiar" v-close-popup />
            <q-btn flat label="Aceptar" color="primary" @click="agregarEditarBoleto" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

    </div>
  </div>
</template>
    
<script setup>
import { onMounted, ref } from "vue";
import { useboletoStore } from "../stores/boleto.js";


const boletoStore = useboletoStore()

const modal = ref(false)
const rows = ref([]);
const fecha_venta = ref("");
const hora_venta = ref("");
const fecha_salida = ref("");
const hora_salida = ref("");
const Precio = ref("");
const cliente = ref("");
const bus = ref("");
const ruta = ref("");
const conductor = ref("");
const vendedor = ref("");
const boletoEditando = ref(null);

const loading = ref(false);
const dataLoaded = ref(false);

const columns = [
  { name: "fecha_venta", required: true, label: "Fecha_Venta", align: "left", field: (row) => row.fechas[0].fecha_salida, sortable: true },
  { name: "hora_venta", required: true, label: "Hora_Venta", align: "left", field: (row) => row.fechas[0].hora_venta, sortable: true },
  { name: "fecha_salida", required: true, label: "Fecha_Salida", align: "left", field: (row) => row.fechas[0].fecha_salida, sortable: true },
  { name: "hora_salida", required: true, label: "Hora_salida", align: "left", field: (row) => row.fechas[0].hora_salida, sortable: true },
  { name: "Precio", required: true, label: "Precio", align: "left", field: "Precio", sortable: true },
  { name: "cliente", required: true, label: "Cliente", align: "left", field: "cliente", sortable: true },
  { name: "bus", required: true, label: "Bus", align: "left", field: "bus", sortable: true },
  { name: "ruta", required: true, label: "Ruta", align: "left", field: "ruta", sortable: true },
  { name: "conductor", required: true, label: "Conductor", align: "left", field: "conductor", sortable: true },
  { name: "vendedor", required: true, label: "Vendedor", align: "left", field: "vendedor", sortable: true },
  /* { name: "status", label: "Status", align: "left", field: "status", sortable: true }, */
  { name: "acciones", required: true, label: "Acciones", align: "center", field: "acciones", },
];

const obtenerBoleto = async () => {
  loading.value = true;
  try {
    const response = await boletoStore.obtener();
    dataLoaded.value = true;
    console.log(response);
    if (response && response.boletoPopulate) {
      rows.value = response.boletoPopulate;
    }
  } catch (error) {
    console.error('Error al obtener los boletos:', error);
  } finally {
    loading.value = false;
  }
};


const agregarEditarBoleto = async () => {
  if (boletoEditando.value) {
    const boletoEditado = {
      _id: boletoEditando.value._id,
      fecha_venta: fecha_venta.value,
      hora_venta: hora_venta.value,
      fecha_salida: fecha_salida.value,
      hora_salida: hora_salida.value,
      Precio: Precio.value,
      cliente: cliente.value,
      bus: bus.value,
      ruta: ruta.value,
      conductor: conductor.value,
      vendedor: vendedor.value,
      fecha: fecha.value.split('T')[0],
    };
    try {
      await boletoStore.editarBoleto(boletoEditado);
      fecha_venta.value = "";
      hora_venta.value = "";
      fecha_salida.value = "";
      hora_salida.value = "";
      Precio.value = "";
      cliente.value = "";
      bus.value = "";
      ruta.value = "";
      conductor.value = "";
      vendedor.value = "";
      modal.value = false;
      rutaEditando.value = null;
      obtenerBoleto();
    } catch (error) {
      console.error('Error al editar el boleto:', error);
    }
  } else {
    const nuevoBoleto = {
      fecha_venta: fecha_venta.value,
      hora_venta: hora_venta.value,
      fecha_salida: fecha_salida.value,
      hora_salida: hora_salida.value,
      Precio: Precio.value,
      cliente: cliente.value,
      bus: bus.value,
      ruta: ruta.value,
      conductor: conductor.value,
      vendedor: vendedor.value,
      fecha: fecha.value.split('T')[0],
    };
    try {
      await rutaStore.agregarBoleto(nuevoBoleto);
      fecha_venta.value = "";
      hora_venta.value = "";
      fecha_salida.value = "";
      hora_salida.value = "";
      Precio.value = "";
      cliente.value = "";
      bus.value = "";
      ruta.value = "";
      conductor.value = "";
      vendedor.value = "";
      modal.value = false;
      obtenerBoleto();
      limpiar();
    } catch (error) {
      console.error('Error al agregar el boleto:', error);
    }
  }
}

const editarBoleto = (boleto) => {
  fecha_venta.value = boleto.fecha_venta;
  hora_venta.value = boleto.hora_venta;
  fecha_salida.value = boleto.fecha_salida;
  hora_salida.value = boleto.hora_salida;
  Precio.value = boleto.Precio;
  cliente.value = boleto.cliente;
  bus.value = boleto.bus;
  ruta.value = boleto.ruta;
  conductor.value = boleto.conductor;
  vendedor.value = boleto.vendedor;
  fecha.value = boleto.fecha;
  boletoEditando.value = boleto;
  modal.value = true;
}

const limpiar = () => {
  fecha_venta.value = "";
  hora_venta.value = "";
  fecha_salida.value = "";
  hora_salida.value = "";
  Precio.value = "";
  cliente.value = "";
  bus.value = "";
  ruta.value = "";
  conductor.value = "";
  vendedor.value = "";
  fecha.value = "";
};

async function activar(id) {
  try {
    const ruta = await rutaStore.activarRuta(id);
    console.log('ruta activada:', ruta);
    obtenerRuta();
  } catch (error) {
    console.error('Error al activar ruta:', error);
  }
}

async function desactivar(id) {
  try {
    const ruta = await rutaStore.desactivarRuta(id);
    console.log('ruta desactivada:', ruta);
    obtenerRuta();
  } catch (error) {
    console.error('Error al desactivar ruta:', error);
  }
}


onMounted(() => {
  obtenerBoleto()
});

</script>
      
<style scoped>
.color1 {
  color: rgb(136, 226, 0);
}

.color2 {
  color: red;
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
      
    