import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { Notify } from 'quasar'

export const useBusStore = defineStore("bus", () => {
    const datosData = ref([]);
    const loading = ref(false);

    const obtener = async () => {
        try {
            const response = await axios.get("bus/ver");
            datosData.value = response.data;
            return response.data;
        } catch (error) {
            console.error('Error al obtener los buses:', error);
            throw error;
        }
    };

    const agregarBus = async (nuevoBus) => {
        try {
            const response = await axios.post("bus/agregar", nuevoBus);
            obtener();
        } catch (error) {
            console.error('Error al agregar el bus:', error);
            throw error;
        }
    };

    const editarBus = async (busEditado) => {
        try {
            const response = await axios.put(`bus/modificar/${busEditado._id}`, busEditado);
            obtener();
        } catch (error) {
            console.error('Error al editar bus:', error);
            throw error;
        }
    };

    const activarBus = async (busId) => {
        loading.value = true
        try {
            const response = await axios.put(`bus/activar/${busId}`);
            Notify.create({
                type: "positive",
                color: "green",
                message: "Bus Activado",
            });
            obtener();
        } catch (error) {
            console.error('Error al activar bus:', error);
            Notify.create({
                type: "negative",
                color: "primary",
                message: error.response.data.errors[0].msg,
            });
        } finally {
            loading.value = false
        }
    };

    const desactivarBus = async (busId) => {
        loading.value = true
        try {
            const response = await axios.put(`bus/inactivar/${busId}`);
            Notify.create({
                type: "positive",
                color: "red",
                message: "Bus Desactivado",
            });
            obtener();
        } catch (error) {
            console.error('Error al desactivar bus:', error);
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
        loading,
        obtener,
        agregarBus,
        editarBus,
        activarBus,
        desactivarBus,

    };
});
