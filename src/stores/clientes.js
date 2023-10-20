import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useClienteStore = defineStore("cliente", () => {
    const datosData = ref([])

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
            console.log("cliente Agregado",response.data);
            obtener(); 
        } catch (error) {
            console.error('Error al agregar cliente:', error);
            throw error;
        }
    };

    const editarCliente = async (clienteEditado) => {
        try {
            const response = await axios.put(`cliente/modificar/${clienteEditado._id}`, clienteEditado);
            console.log("cliente Editado",response.data);
            obtener();
        } catch (error) {
            console.error('Error al editar cliente:', error);
            throw error;
        }
    };

    const activarCliente = async (clienteId) => {
        try {
            const response = await axios.put(`cliente/activar/${clienteId}`);
            console.log("cliente Activado",response.data);
            obtener();
        } catch (error) {
            console.error('Error al activar cliente:', error);
            throw error;
        }
    };

    const desactivarCliente = async (clienteId) => {
        try {
            const response = await axios.put(`cliente/inactivar/${clienteId}`);
            console.log("cliente Desactivado",response.data); 
            obtener();
        } catch (error) {
            console.error('Error al desactivar cliente:', error);
            throw error;
        }
    };

    return {
        datosData,
        obtener,
        agregarCliente,
        editarCliente,
        activarCliente,
        desactivarCliente
    };
});

