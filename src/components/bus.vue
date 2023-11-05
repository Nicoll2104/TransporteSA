<template>
  <div class="q-pa-md">
    <div class="cargar_contenedor">
      <div class="title">
        <h3>Datos Buses</h3>
        <div class="raya"></div>
      </div><br>


      <div class="agre"><q-btn label="Agregar" color="blue" @click="modal = true" /></div><br>

      <q-table title="DATOS BUSES" :rows="rows" :columns="columns" row-key="cedula">
        <template v-slot:body-cell-status="props">
          <q-td key="status" :props="props">
            <span class="color1" v-if="props.row.status == 1">Activo</span>
            <span class="color2" v-else>Inactivo</span>
          </q-td>
        </template>
        <template v-slot:body-cell-acciones="props">
          <q-td key="acciones" :props="props">
            <q-btn class="btnEditar" icon="edit" color="primary" @click="editarBus(props.row)"></q-btn>
            <q-btn class="btnActivar" v-if="props.row.status == 1" @click="desactivar(props.row._id)">❌</q-btn>
            <q-btn class="btnActivar" v-else @click="activar(props.row._id)">✅</q-btn>
          </q-td>
        </template>
      </q-table>
      <q-dialog v-model="modal">
        <q-card>

          <q-card-section class="arri">
          <div class="text-h6">DATOS DE BUSES</div>
        </q-card-section>

          

          <q-separator />

          <q-card-section>
            <div class="infoDatos">
              <div class="ilDatos">
                <label class="labelDatos" for="placa">Placa:</label>
                <input class="inputDatos" type="text" id="placa" v-model="placa" />
              </div>

              <div class="ilDatos">
                <label class="labelDatos" for="modelo">Modelo:</label>
                <input class="inputDatos" type="text" id="modelo" v-model="modelo" />
              </div>

              <div class="ilDatos">
                <label class="labelDatos" for="soat"> Soat:</label>
                <input class="inputDatos" type="date" id="soat" v-model="soat" />
              </div>

              <div class="ilDatos">
                <label class="labelDatos" for="n_asiento">Numero asientos:</label>
                <input class="inputDatos" type="number" id="n_asiento" v-model="n_asiento" />
              </div>

              <div class="ilDatos">
                <label class="labelDatos" for="empresa_asignada">Empresa:</label>
                <input class="inputDatos" type="text" id="empresa_asignada" v-model="empresa_asignada" />
              </div>

            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="center">

            <q-btn flat label="Cerrar"  
            class="btnc"  
            @click="limpiar" 
            color="white"
            v-close-popup />

            <q-btn flat label="Aceptar" 
            class="btna"  
            @click="agregarEditarBus"
            color="white"
            :loading="cargando" />
          </q-card-actions>

        </q-card>
      </q-dialog>

    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useBusStore } from '../stores/bus.js';
import { useQuasar } from 'quasar'
import { format } from 'date-fns';

const busStore = useBusStore()

const rows = ref([])
const modal = ref(false);
const placa = ref("");
const modelo = ref("");
const soat = ref("");
const n_asiento = ref("");
const empresa_asignada = ref("");
const busEditando = ref(null);
const $q = useQuasar()

const cargando = ref(false);  
const modalAbierto = ref(false);


const columns = [
  { name: "placa", required: true, label: "Placa", align: "center", field: "placa", format: (val) => val, },
  { name: "modelo", required: true, label: "Modelo", align: "center", field: "modelo", sortable: true },
  {
  name: "soat",
  required: true,
  label: "Soat",
  align: "center",
  field: "soat",
  sortable: true,
  format: (val) => {
    return format(new Date(val), "yyyy-MM-dd");
  },
},
  { name: "n_asiento", required: true, label: "Número de asientos", align: "center", field: "n_asiento", sortable: true },
  { name: "empresa_asignada", required: true, label: "Empresa_asignada", align: "center", field: "empresa_asignada", sortable: true },
  { name: "status", label: "Estado", align: "center", field: "status", sortable: true },
  { name: "acciones", required: true, label: "Acciones", align: "center", field: "acciones", },
];

async function obtenerBus() {
  try {
    const buses = await busStore.obtener();
    console.log('Buses obtenidos:', buses);
    rows.value = busStore.datosData.buses;
  } catch (error) {
    console.error('Error al obtener los clientes:', error);
  }
}

const agregarEditarBus = async () => {
  cargando.value = true; 
  modalAbierto.value = true;

  if (busEditando.value) {
    const busEditado = {
      _id: busEditando.value._id,
      placa: placa.value,
      modelo: modelo.value,
      soat: soat.value,
      n_asiento: n_asiento.value,
      empresa_asignada: empresa_asignada.value,
    };
    try {
      await busStore.editarBus(busEditado);
      placa.value = "";
      modelo.value = "";
      soat.value = "";
      n_asiento.value = "";
      empresa_asignada.value = "";
      modal.value = false;
      busEditando.value = null;
      $q.notify({
        message: 'Bus editado correctamente',
        textColor: 'white',
        type: "positive",
        color: 'green',
      });
      obtenerBus();
    } catch (error) {
      console.error('Error al editar el bus:', error);
      $q.notify({ type: 'negative', color: 'negative', message: error.response.data.error.errors[0].msg });
    }
  } else {
    const nuevoBus = {
      placa: placa.value,
      modelo: modelo.value,
      soat: soat.value,
      n_asiento: n_asiento.value,
      empresa_asignada: empresa_asignada.value,
    };
    try {
      await busStore.agregarBus(nuevoBus);
      placa.value = "";
      modelo.value = "";
      soat.value = "";
      n_asiento.value = "";
      empresa_asignada.value = "";
      modal.value = false;
      $q.notify({
        message: 'Bus agregado correctamente',
        textColor: 'white',
        type: "positive",
        color: 'green',
      });
      obtenerBus();
      limpiar();
    } catch (error) {
      console.error('Error al agregar el bus:', error);
      $q.notify({ type: 'negative', color: 'negative', message: error.response.data.error.errors[0].msg });
    }
  }
  cargando.value = false;
  modalAbierto.value = false;
}

const editarBus = (bus) => {
  placa.value = bus.placa;
  modelo.value = bus.modelo;
  soat.value = bus.soat;
  n_asiento.value = bus.n_asiento;
  empresa_asignada.value = bus.empresa_asignada;
  busEditando.value = bus;
  modal.value = true;
  $q.notify({
        message: `Editando al conductor ${bus.empresa_asignada}`,
        textColor: 'white',
        icon: "edit",
        color: 'info',
      });
}

const limpiar = () => {
  placa.value = "";
  modelo.value = "";
  soat.value = "";
  n_asiento.value = "";
  empresa_asignada.value = "";
};


async function activar(id) {
  try {
    const bus = await busStore.activarBus(id);
    obtenerBus();
  } catch (error) {
    console.error('Error al activar Bus:', error);
  }
}

async function desactivar(id) {
  try {
    const bus = await busStore.desactivarBus(id);

    obtenerBus();
  } catch (error) {
    console.error('Error al desactivar Bus:', error);
  }
}

onMounted(() => {
  obtenerBus()
})

</script>


  
<style scoped>
.q-card {
  display: flex;
  width: 100%;
  height: 55%;
  flex-direction: column;
  align-items: center;
}

.btna {
  background-color: #1976d2;
}
.btnc {
  background-color: rgb(210, 25, 25);
}
.inputDatos {
  width: 340px;
  height: 3vh;
  border: none;
  background-color: rgba(241, 233, 233, 0.589);
  border-radius: 10px;
  margin: 8px;
}

.btnEditar {
  margin: 5px;
}

label {
  display: flex;
  align-items: center;
  flex-direction: column;
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

.arri {
  display: flex;
  justify-content: center;
  background-color: #1976d2;
  color: #ffffff;
  width: 100%;
}
</style>