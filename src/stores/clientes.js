import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { Notify } from 'quasar'

export const useClienteStore = defineStore("cliente", () => {
    const datosData = ref([])
    const loading = ref(false);

    const obtener = async () => {
        try {
            const response = await axios.get("cliente/ver");
            datosData.value = response.data;
            return response.data;
        } catch (error) {
            console.error('Error al obtener clientes:', error);
            throw error;
        }
    };

    const agregarCliente = async (nuevoCliente) => {
        try {
            const response = await axios.post('cliente/agregar', nuevoCliente);
            obtener();
        } catch (error) {
            console.error('Error al agregar cliente:', error);
            throw error;
        }
    };

    const editarCliente = async (clienteEditado) => {
        try {
            const response = await axios.put(`cliente/modificar/${clienteEditado._id}`, clienteEditado);
            obtener();
        } catch (error) {
            console.error('Error al editar cliente:', error);
            throw error;
        }
    };

    const activarCliente = async (clienteId) => {
        loading.value = true
        try {
            const response = await axios.put(`cliente/activar/${clienteId}`);
            Notify.create({
                type: "positive",
                color: "green",
                message: "Cliente Activado",
            });
        } catch (error) {
            console.error('Error al activar cliente:', error);
            Notify.create({
                type: "negative",
                message: error.response.data.errors[0].msg,
            });
        } finally {
            loading.value = false
        }
    };

    const desactivarCliente = async (clienteId) => {
        loading.value = true
        try {
            const response = await axios.put(`cliente/inactivar/${clienteId}`);
            Notify.create({
                type: "positive",
                color: "red", 
                message: "Cliente Desactivado",
            });
        } catch (error) {
            console.error('Error al desactivar cliente:', error);
            Notify.create({
                type: "negative",
                color: "primary",
                message: error.response.data.error.errors[0].msg,
            });
        } finally {
            loading.value = false
        }
    };

    return {
        datosData,
        loading,
        obtener,
        agregarCliente,
        editarCliente,
        activarCliente,
        desactivarCliente
        
    };
});

