import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { Notify } from 'quasar';

export const useConductorStore = defineStore("conductor", () => {
    const datosData = ref([]);
    const loading = ref(false);

    const obtener = async () => {
        try {
            const response = await axios.get("conductor/ver");
            datosData.value = response.data;
            return response.data; 
        } catch (error) {
            console.error('Error al obtener el conductor:', error);
            throw error;
        }
    };

    const agregarConductor = async (nuevoConductor) => {
        try {
            const response = await axios.post("conductor/agregar", nuevoConductor);
            console.log("conductor Agregado",response.data);
        } catch (error) {
            console.error('Error al agregar el conductor:', error);
            throw error;
        }
    };

    const editarConductor = async (conductorEditado) => {
        try {
            const response = await axios.put(`conductor/modificar/${conductorEditado._id}`, conductorEditado);
            console.log(response.data);
            obtener();
        } catch (error) {
            console.error('Error al editar conductor:', error);
            throw error;
        } 
    };

    const activarConductor = async (conductorId) => {
        loading.value = true
        try {
            const response = await axios.put(`conductor/activar/${conductorId}`);
            Notify.create({
                type: "positive",
                color: "green", 
                message: "Conductor Activado",
            });
            obtener();
        } catch (error) {
            console.error('Error al activar el conductor:', error);
            Notify.create({
                type: "negative",
                color: "primary",
                message: error.response.data.errors[0].msg,
            });
        } finally {
            loading.value = false
        }
    };

    const desactivarConductor = async (conductorId) => {
        loading.value = true
        try {
            const response = await axios.put(`conductor/inactivar/${conductorId}`);
            Notify.create({
                type: "positive",
                color: "red", 
                message: "Conductor Desactivado",
            });
            obtener();
        } catch (error) {
            console.error('Error al desactivar el conductor:', error);
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
        agregarConductor,
        editarConductor,
        activarConductor,
        desactivarConductor
    };

});