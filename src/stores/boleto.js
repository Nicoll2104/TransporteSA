import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useboletoStore = defineStore("boleto", () => {
    const datosData = ref([])

    const obtener = async () => {
        try {
            const response = await axios.get("boleto/ver");
            datosData.value = response.data;
            return response.data; 
        } catch (error) {
            console.error('Error al obtener la boleto:', error);
            throw error;
        }
    };

    /*  const agregarBoleto = async (nuevoBoleto) => {
        try {
            const response = await axios.post("boleto/agregar", nuevoBoleto);
            return response.data;
        } catch (error) {
            console.error('Error al agregar el boleto:', error);
            throw error;
        }
    };

    const editarBoleto = async (boletoEditado) => {
        try {
            const response = await axios.put(`boleto/modificar/${boletoEditado._id}`, boletoEditado);
            console.log(response.data);
            obtener();
        } catch (error) {
            console.error('Error al editar boleto:', error);
            throw error;
        }
    }; */

    /* const activarRuta = async (rutaId) => {
        try {
            const response = await axios.put(`ruta/activar/${rutaId}`);
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
            obtener();
            return response.data.rutas;
        } catch (error) {
            console.error('Error al desactivar la ruta:', error);
            throw error;
        }
    }; */

    return {
        datosData,
        obtener,
    /*   agregarBoleto,
        editarBoleto, */
    };

});