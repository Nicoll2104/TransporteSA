<template>
  <div class="q-pa-md">
    <div class="title"><h3>Datos Buses</h3>

<div class="raya"></div>
</div><br>

<div class="agre"><q-btn label="Agregar" color="blue" @click="modal = true" /></div><br><br>

<q-table title="DATOS BUSES" :rows="rows" :columns="columns" row-key="cedula" :loading="isLoading">
      <template v-slot:body-cell-status="props">
        <q-td key="status" :props="props">
          <span class="color1" v-if="props.row.status == 1">Activo</span>
          <span class="color2" v-else>Inactivo</span>
        </q-td>
      </template>
      <template v-slot:body-cell-acciones="props">
        <q-td key="acciones" :props="props">
          <q-btn class="btnEditar" icon="edit" color="amber" @click="editarBus(props.row)"></q-btn>
          <q-btn class="btnActivar" v-if="props.row.status == 1" @click="desactivar(props.row._id)">❌</q-btn>
          <q-btn class="btnActivar" v-else @click="activar(props.row._id)">✅</q-btn>
        </q-td>
      </template>
    </q-table>
    <q-dialog v-model="modal">
      <q-card>
        <q-card-section>
          <div class="text-h6">DATOS DE BUSES</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">
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
              <input class="inputDatos" type="text" id="soat" v-model="soat" />
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

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" @click="limpiar" v-close-popup />
          <q-btn flat label="Aceptar" color="primary" @click="agregarEditarBus" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-btn label="Agregar" color="primary" @click="modal = true" />

  </div>
</template>

<script setup>

import { onMounted, ref } from "vue";
import { useBusStore } from '../stores/bus.js';

const busStore = useBusStore()

const rows = ref([])
const modal = ref(false);
const placa = ref("");
const modelo = ref("");
const soat = ref("");
const n_asiento = ref("");
const empresa_asignada = ref("");
const busEditando = ref(null);
const isLoading = ref(false);

const columns = [
  { name: "placa", required: true, label: "Placa", align: "left", field: "placa", format: (val) => val, },
  { name: "modelo", required: true, label: "Modelo", align: "left", field: "modelo", sortable: true },
  { name: "soat", required: true, label: "Soat", align: "left", field: "soat", sortable: true },
  { name: "n_asiento", required: true, label: "Número_asiento", align: "left", field: "n_asiento", sortable: true },
  { name: "empresa_asignada", required: true, label: "Empresa_asignada", align: "left", field: "empresa_asignada", sortable: true },
  { name: "status", label: "Estado", align: "left", field: "status", sortable: true },
  { name: "acciones", required: true, label: "Acciones", align: "center", field: "acciones", },
];

async function obtenerBus() {
  isLoading.value = true; 
  try {
    const buses = await busStore.obtener();
    console.log('Buses obtenidos:', buses);
    rows.value = busStore.datosData.buses;
  } catch (error) {
    console.error('Error al obtener los buses:', error);
  } finally {
    isLoading.value = false;
  }
}


const agregarEditarBus = async () => {
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
      obtenerBus();
    } catch (error) {
      console.error('Error al editar el bus:', error);
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
      obtenerBus();
      limpiar();
    } catch (error) {
      console.error('Error al agregar el bus:', error);
    }
  }
}

const editarBus = (bus) => {
  placa.value = bus.placa;
  modelo.value = bus.modelo;
  soat.value = bus.soat;
  n_asiento.value = bus.n_asiento;
  empresa_asignada.value = bus.empresa_asignada;
  busEditando.value = bus;
  modal.value = true;
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
    console.log('Bus activado:', bus);
    obtenerBus();
  } catch (error) {
    console.error('Error al activar Bus:', error);
  }
}

async function desactivar(id) {
  try {
    const bus = await busStore.desactivarBus(id);
    console.log('Bus desactivado:', bus);
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

.btnEditar {
  margin: 5px;
}


label {
  margin-right: 20px;
}
.agre{
  display: flex;
  justify-content: flex-end;
}
.title{
  display: flex;
    flex-direction: column;
    align-items: center;
}
h3{
  font-weight: bold;
}

.raya{
  background-color: rgba(50, 107, 253, 0.85);
  width: 50%;
  height: 5px;
}
</style>
  
