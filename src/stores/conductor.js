import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useConductorStore = defineStore("conductor", () => {
    const datosData = ref([])

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
        try {
            const response = await axios.put(`conductor/activar/${conductorId}`);
           /*  console.log(response.data);  */
            obtener();
            return response.data.conductores;
        } catch (error) {
            console.error('Error al activar el conductor:', error);
            throw error;
        }
    };

    const desactivarConductor = async (conductorId) => {
        try {
            const response = await axios.put(`conductor/inactivar/${conductorId}`);
           /*  console.log(response.data);  */
            obtener();
            return response.data.conductores;
        } catch (error) {
            console.error('Error al desactivar el conductor:', error);
            throw error;
        }
    };

    return {
        datosData,
        obtener,
        agregarConductor,
        editarConductor,
        activarConductor,
        desactivarConductor
    };

});