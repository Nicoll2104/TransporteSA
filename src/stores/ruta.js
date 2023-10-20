import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useRutaStore = defineStore("ruta", () => {
    const datosData = ref([])

    const obtener = async () => {
        try {
            const response = await axios.get("ruta/ver");
            datosData.value = response.data;
            return response.data; 
        } catch (error) {
            console.error('Error al obtener la ruta:', error);
            throw error;
        }
    };

    const agregarRuta = async (nuevoRuta) => {
        try {
            const response = await axios.post("ruta/agregar", nuevoRuta);
            return response.data;
        } catch (error) {
            console.error('Error al agregar la ruta:', error);
            throw error;
        }
    };

    const activarRuta = async (rutaId) => {
        try {
            const response = await axios.put(`ruta/activar/${rutaId}`);
           /*  console.log(response.data);  */
            obtener();
            return response.data.rutas;
        } catch (error) {
            console.error('Error al activar la ruta:', error);
            throw error;
        }
    };

    const desactivarRuta = async (rutaId) => {
        try {
            const response = await axios.put(`ruta/inactivar/${rutaId}`);
            /* console.log(response.data);  */
            obtener();
            return response.data.rutas;
        } catch (error) {
            console.error('Error al desactivar la ruta:', error);
            throw error;
        }
    };

    return {
        datosData,
        obtener,
        agregarRuta,
        activarRuta,
        desactivarRuta
    };



})