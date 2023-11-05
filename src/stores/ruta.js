import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { Notify } from 'quasar'

export const useRutaStore = defineStore("ruta", () => {
    const datosData = ref([]);
    const loading = ref(false);

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
            obtener();
        } catch (error) {
            console.error('Error al agregar la ruta:', error);
            throw error;
        }
    };

    const editarRuta = async (rutaEditado) => {
        try {
            const response = await axios.put(`ruta/modificar/${rutaEditado._id}`, rutaEditado);
            obtener();
        } catch (error) {
            console.error('Error al editar ruta:', error);
            throw error;
        }
    };

    const activarRuta = async (rutaId) => {
        loading.value = true
        try {
            const response = await axios.put(`ruta/activar/${rutaId}`);
            Notify.create({
                type: "positive",
                color: "green",
                message: "Ruta Activada",
            });
            obtener();
            return response.data.rutas;
        } catch (error) {
            console.error('Error al activar la ruta:', error);
            Notify.create({
                type: "negative",
                color: "primary",
                message: error.response.data.errors[0].msg,
            });
        } finally {
            loading.value = false
        }
    };

    const desactivarRuta = async (rutaId) => {
        loading.value = true
        try {
            const response = await axios.put(`ruta/inactivar/${rutaId}`);
            Notify.create({
                type: "positive",
                color: "red",
                message: "Ruta Desactivada",
            });
            obtener();
            return response.data.rutas;
        } catch (error) {
            console.error('Error al desactivar la ruta:', error);
            Notify.create({
                type: "negative",
                color: "primary",
                message: error.response.data.errors[0].msg,
            });
        } finally {
            loading.value = false
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