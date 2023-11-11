<template>
    <button>awaeff</button>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRutaStore } from "../stores/ruta.js";
import { useBusStore } from '../stores/bus.js';


const busStore = useBusStore()
const rutaStore = useRutaStore()


async function obtenerBus() {
  try {
    const response = await busStore.obtener();
    if (Array.isArray(response.buses)) {
      const empresasAsignadas = response.buses.map(bus => `${bus.empresa_asignada} / ${bus.n_asiento}`);
      opcionesBuses.value = empresasAsignadas;
      rows.value = empresasAsignadas;
    } else {
      console.error('Los datos de los buses no son un array válido:', response.buses);
    }
  } catch (error) {
    console.error('Error al obtener los buses:', error);
  }
}


async function obtenerRuta() {
  try {
    const responseRuta = await rutaStore.obtener();
    if (Array.isArray(responseRuta)) {
      const origenRutaDestino = responseRuta.map(ruta => `${ruta.origen} - ${ruta.destino} / ${ruta.horarios}`);
      opcionesRutas.value = origenRutaDestino;
      rows.value = origenRutaDestino;
    } else {
      console.error('Los datos de los ruta no son un array válido:', responseRuta);
    }
  } catch (error) {
    console.error('Error al obtener los ruta:', error);
  }
}

onMounted(() => {
  obtenerBoleto();
  obtenerRuta();
  obtenerBus(); 
});
</script>