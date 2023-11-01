import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useRutaStore = defineStore("ruta", () => {
    const datosData = ref([]);

    const obtener = async () => {
        try {
            const response = await axios.get("ruta/ver");
            console.log(response);
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

    const editarRuta = async (rutaEditado) => {
        try {
            const response = await axios.put(`ruta/modificar/${rutaEditado._id}`, rutaEditado);
            console.log(response.data);
            obtener();
        } catch (error) {
            console.error('Error al editar ruta:', error);
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
        editarRuta,
        activarRuta,
        desactivarRuta
    };

});