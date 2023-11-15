<template>
  <div class="q-pa-md">

    <div class="title">
      <h3>Datos Rutas</h3>

      <div class="raya"></div>
    </div><br><br>

    <div class="agre"><q-btn label="Agregar" color="blue" @click="modal = true" /></div><br><br>

    <q-table title="DATOS RUTAS" :rows="rows" :columns="columns" row-key="origen" class="tableRT">
      <template v-slot:body-cell-status="props">
        <q-td key="status" :props="props">
          <span class="color1" v-if="props.row.status == 1">Activo</span>
          <span class="color2" v-else>Inactivo</span>
        </q-td>
      </template>
      <template v-slot:body-cell-acciones="props">
        <q-td key="acciones" :props="props">
          <q-btn class="btnEditar" icon="edit" color="blue" @click="editarRuta(props.row)"></q-btn>
          <q-btn class="btnActivar" v-if="props.row.status == 1" @click="desactivar(props.row._id)">❌</q-btn>
          <q-btn class="btnActivar" v-else @click="activar(props.row._id)">✅</q-btn>
        </q-td>
      </template>
    </q-table>


    <q-dialog v-model="modal">
      <q-card class="conten_modal">
        <q-card-section class="arri">
          <div class="text-h6">DATOS DE RUTAS</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="imagen_formulario">
            <div class="infoDatos">
              <div class="conten_input">
                <label for="ORIGEN">Origen</label>
                <div class="containerInput">
                  <input placeholder="Origen" type="text" id="ORIGEN" v-model="origen" autocomplete="on">
                </div>
                <span class="error">{{ errorOrigen }}</span>
              </div>
              <br>
              <div class="conten_input">
                <label for="DESTINO">Destino</label>
                <div class="containerInput">
                  <input placeholder="Destino" type="text" id="DESTINO" v-model="destino" autocomplete="on">
                </div>
                <span class="error">{{ errorDestino }}</span>
              </div>
              <br>
              <div class="conten_input">
                <label for="HORARIOS">Horario</label>
                <div class="containerInput">
                  <input placeholder="Horario" type="text" id="HORARIOS" v-model="horarios" autocomplete="on">
                </div>
                <span class="error">{{ errorHorario }}</span>
              </div>
              <br>
              <div class="conten_input">
                <label for="DISTANCIA">Distancia</label>
                <div class="containerInput">
                  <input placeholder="Distancia" type="text" id="DISTANCIA" v-model="distancia" autocomplete="on">
                </div>
                <span class="error">{{ errorDistancia }}</span>
              </div>
              <br>
              <div class="conten_input">
                <label for="DURACION">Duracion</label>
                <div class="containerInput">
                  <input placeholder="Duracion" type="text" id="DURACION" v-model="duracion" autocomplete="on">
                </div>
                <span class="error">{{ errorDuracion }}</span>
              </div>
              <br>
              <div class="conten_input">
                <label for="FECHA">Fecha</label>
                <div class="containerInput">
                  <input placeholder="Fecha" type="date" id="FECHA" v-model="fecha" autocomplete="on">
                </div>
                <span class="error">{{ errorFecha }}</span>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="white" @click="limpiar" class="btnc" v-close-popup />
          <q-btn flat label="Aceptar" color="white" class="btna" @click="agregarEditarRuta" :loading="cargando" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
  
<script setup>
import { onMounted, ref } from "vue";
import { useRutaStore } from "../stores/ruta.js";
import { useQuasar } from 'quasar'

const rutaStore = useRutaStore()

const modal = ref(false)
const rows = ref([]);
const origen = ref("");
const destino = ref("");
const horarios = ref("");
const distancia = ref("");
const duracion = ref("");
const fecha = ref("");
const rutaEditando = ref(null);
const $q = useQuasar()

const cargando = ref(false);
const modalAbierto = ref(false);

const columns = [
  { name: "origen", required: true, label: "Origen", align: "center", field: "origen", sortable: true },
  { name: "destino", required: true, label: "Destino", align: "center", field: "destino", sortable: true },
  { name: "horarios", required: true, label: "Horario", align: "center", field: "horarios", sortable: true },
  { name: "distancia", required: true, label: "Distancia", align: "center", field: "distancia", sortable: true },
  { name: "duracion", required: true, label: "Duracion", align: "center", field: "duracion", sortable: true },
  { name: "fecha", required: true, label: "Fecha", align: "center", field: "fecha", sortable: true },
  { name: "status", label: "Status", align: "center", field: "status", sortable: true },
  { name: "acciones", required: true, label: "Acciones", align: "center", field: "acciones", },
];

async function obtenerRuta() {
  try {
    const rutas = await rutaStore.obtener();
    console.log('rutas obtenidas:', rutas);
    rows.value = rutaStore.datosData;
  } catch (error) {
    console.error('Error al obtener las rutas:', error);
  }
}




const errorOrigen = ref("");
const errorDestino = ref("");
const errorHorario = ref("");
const errorDistancia = ref("");
const errorDuracion = ref("");
const errorFecha = ref("");

const agregarEditarRuta = async () => {

  if (!origen.value) {
    errorOrigen.value = "Por favor, ingresa un origen";
    clearErrors();
    console.log("Error de origen");
    return;
  }

  if (!destino.value) {
    errorDestino.value = "Por favor, ingresa un destino";
    clearErrors();
    console.log("Error de destino");
    return;
  }

  if (!horarios.value) {
    errorHorario.value = "Por favor, ingresa un horario";
    clearErrors();
    console.log("Error de horario");
    return;
  }

  if (!distancia.value) {
    errorDistancia.value = "Por favor, ingresa la distancia";
    clearErrors();
    console.log("Error de distancia");
    return;
  }

  if (!duracion.value) {
    errorDuracion.value = "Por favor, ingresa la duracion";
    clearErrors();
    console.log("Error de duracion");
    return;
  }

  if (!fecha.value) {
    errorFecha.value = "Por favor, ingresa la fecha";
    clearErrors();
    console.log("Error de fecha");
    return;
  }


  if (rutaEditando.value) {
    const rutaEditado = {
      _id: rutaEditando.value._id,
      origen: origen.value,
      destino: destino.value,
      horarios: horarios.value,
      distancia: distancia.value,
      duracion: duracion.value,
      fecha: fecha.value.split('T')[0],
    };
    try {
      await rutaStore.editarRuta(rutaEditado);
      origen.value = "";
      destino.value = "";
      horarios.value = "";
      distancia.value = "";
      duracion.value = "";
      fecha.value = "";
      modal.value = false;
      rutaEditando.value = null;
      $q.notify({
        message: 'Ruta editado correctamente',
        textColor: 'white',
        type: "positive",
        color: 'green',
      });
      obtenerRuta();
    } catch (error) {
      console.error('Error al editar la Ruta:', error);
      $q.notify({ type: 'negative', color: 'negative', message: error.response.data.error.errors[0].msg });
    }
  } else {
    const nuevoRuta = {
      origen: origen.value,
      destino: destino.value,
      horarios: horarios.value,
      distancia: distancia.value,
      duracion: duracion.value,
      fecha: fecha.value.split('T')[0],
    };
    try {
      await rutaStore.agregarRuta(nuevoRuta);
      origen.value = "";
      destino.value = "";
      horarios.value = "";
      distancia.value = "";
      duracion.value = "";
      fecha.value = "";
      modal.value = false;
      $q.notify({
        message: 'Ruta agregado correctamente',
        textColor: 'white',
        type: "positive",
        color: 'green',
      });
      obtenerRuta();
      limpiar();
    } catch (error) {
      console.error('Error al agregar la ruta:', error);
      $q.notify({ type: 'negative', color: 'negative', message: error.response.data.error.errors[0].msg });
    }
  }
  cargando.value = false;
  modalAbierto.value = false;
}

const editarRuta = (ruta) => {
  origen.value = ruta.origen;
  destino.value = ruta.destino;
  horarios.value = ruta.horarios;
  distancia.value = ruta.distancia;
  duracion.value = ruta.duracion;
  fecha.value = ruta.fecha;
  rutaEditando.value = ruta;
  modal.value = true;
  $q.notify({
    message: "Editando una ruta",
    textColor: 'white',
    icon: "edit",
    color: 'info',
  });
}

const clearErrors = () => {
  setTimeout(()=>{
  errorOrigen.value = "";
  errorDestino.value = "";
  errorHorario.value = "";
  errorDistancia.value = "";
  errorDuracion.value = "";
  errorFecha.value = "";
},4000);
};

const limpiar = () => {
  origen.value = "";
  destino.value = "";
  horarios.value = "";
  distancia.value = "";
  duracion.value = "";
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
  obtenerRuta()
});

</script>
    
<style scoped>

.btna {
  background-color: #1976d2;
}

.color1{
  color: #51ff00;
}

.color2{
  color: #f50a0a;
}

.btnc {
  background-color: rgb(210, 25, 25);
}

.btnEditar {
  margin: 5px;
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
    background-color: #000000;
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
    content: '';
    width: 110%;
    aspect-ratio: 1;
    position: absolute;
    inset: 0 0 0 0;
    margin: auto;
    animation: rotate6234 2.5s ease-in-out infinite;
    z-index: -1;
    background-image: conic-gradient(from 0deg at 50% 50%, #073AFF00 0%, rgb(28, 49, 235) 25%, #073AFF00 25%);
}

.containerInput>input {
    width: 100%;
    height: 35px;
    font-size: inherit;
    border: none;
    padding: 12px;
    background-color: #ffffff;
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
    background: linear-gradient(90deg, #1976d2, #1976d2, #1976d2, #1976d2, #50a3f7);
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

.error{
  color: red;
}

</style>
    
  