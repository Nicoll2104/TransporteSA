<template>
  <div class="q-pa-md">
    <q-table title="DATOS BUSES" :rows="DatosData" :columns="columns" row-key="placa">
      <template v-slot:body-cell-status="props">
        <q-td key="status" :props="props">
          <span class="color1" v-if="props.row.status == 1">Activo</span>
          <span class="color2" v-else >Inactivo</span>
        </q-td>
      </template>
      <template v-slot:body-cell-acciones="props">
    <q-td key="acciones" :props="props">
      <q-btn class="btnEditar" icon="edit" color="amber" @click="editarCliente(props.row)"></q-btn>
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
              <label class="labelDatos" for="placa" >Placa:</label>
              <input class="inputDatos" type="text" id="placa" v-model="placa"  />
            </div>

            <div class="ilDatos">
              <label class="labelDatos" for="modelo" >Modelo:</label>
              <input class="inputDatos" type="text" id="modelo" v-model="modelo" />
            </div>

            <div class="ilDatos">
              <label class="labelDatos" for="soat" > Soat:</label>
              <input class="inputDatos" type="number" id=" soat" v-model="soat" />
            </div>

            <div class="ilDatos">
              <label class="labelDatos" for="n_asiento" >Numero asientos:</label>
              <input class="inputDatos" type="text" id="n_asiento" v-model="n_asiento" />
            </div>

            <div class="ilDatos">
              <label class="labelDatos" for="empresa_asignada" >Empresa:</label>
              <input class="inputDatos" type="text" id="empresa_asignada" v-model="empresa_asignada" />
            </div>

          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
          <q-btn flat label="Aceptar" color="primary" @click="AgregarBus" v-close-popup />
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
let placa = ref("");
let modelo = ref("");
let soat = ref("");
let n_asiento = ref("");
let empresa_asignada = ref("");
let status = ref("");

const columns = [
{ name: "placa", required: true, label: "Placa", align: "left", field: "placa", sortable: true },
{ name: "modelo", required: true, label: "Modelo", align: "left", field: "modelo", sortable: true },
{ name: "soat", required: true, label: "Soat", align: "left", field: "soat", sortable: true },
{ name: "n_asiento", required: true, label: "N_asiento", align: "left", field: "n_asiento", sortable: true },
{ name: "empresa_asignada", required: true, label: "Empresa_asignada", align: "left", field: "empresa_asignada", sortable: true },
{ name: "status", label: "Status", align: "left", field: "status", sortable: true },
{ name: "acciones", required: true, label: "Acciones", align: "center", field: "acciones", },
];

const obtener = async () => {
try {
  const response = await axios.get("bus/ver");
  DatosData.value = response.data.buses; 
} catch (error) {
  console.error('Error al obtener buses:', error);
}
};

async function AgregarBus() {
  const data = {
    placa: placa.value,
    modelo: modelo.value,
    soat: soat.value,
    n_asiento: n_asiento.value,
    empresa_asignada: empresa_asignada.value,
    status: status.value 
  };

  try {
    let res = await axios.post("bus/agregar", data);
    console.log(res);
  
    placa.value = "";
    modelo.value = "";
    soat.value = "";
    n_asiento.value = "";
    empresa_asignada.value = ""; 
    status.value = "";

    obtener();
  } catch (error) {
    console.error(error);
  }
}

obtener()

const activar = async (id) => {
  try {
    const response = await axios.put(`bus/activar/${id}`);
    const bus = response.data.bus;
    if (bus) {
      const buscar = DatosData.value.findIndex((r) => r._id === id);
      DatosData.value.splice(buscar, 1, bus);
    }
  } catch (error) {
    console.error('Error al activar buses:', error);
  }
};

const desactivar = async (id) => {
  try {
    const response = await axios.put(`bus/inactivar/${id}`);
    const bus = response.data.bus;
    if (bus) {
      const buscar = DatosData.value.findIndex((r) => r._id === id);
      DatosData.value.splice(buscar, 1, bus);
    }
  } catch (error) {
    console.error('Error al desactivar buses:', error);
  }
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
  
