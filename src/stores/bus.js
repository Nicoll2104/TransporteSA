import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useBusStore = defineStore("bus", () => {
    const datosData = ref([])

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
            return response.data;
        } catch (error) {
            console.error('Error al agregar el bus:', error);
            throw error;
        }
    };

    const activarBus = async (busId) => {
        try {
            const response = await axios.put(`bus/activar/${busId}`);
            /* console.log(response.data); */ 
            obtener();
            return response.data.bus;
        } catch (error) {
            console.error('Error al activar bus:', error);
            throw error;
        }
    };

    const desactivarBus = async (busId) => {
        try {
            const response = await axios.put(`bus/inactivar/${busId}`);
            /* console.log(response.data); */
            obtener();
            return response.data.bus;
        } catch (error) {
            console.error('Error al desactivar bus:', error);
            throw error;
        }
    };


    return {
        datosData,
        obtener,
        agregarBus,
        activarBus,
        desactivarBus,

    };
});
