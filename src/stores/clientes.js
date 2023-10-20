import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useClienteStore = defineStore("cliente", () => {
    const datosData = ref([])

    const obtener = async () => {
        try {
            const response = await axios.get("cliente/ver");
            datosData.value = response.data;
        } catch (error) {
            console.error('Error al obtener clientes:', error);
        }
    };

    const agregarCliente = async (nuevoCliente) => {
        try {
            const response = await axios.post("cliente/agregar", nuevoCliente);
        } catch (error) {
            console.error('Error al agregar cliente:', error);
            throw error;
        }
    };

    const activarCliente = async (clienteId) => {
        try {
            const response = await axios.put(`cliente/activar/${clienteId}`);
            console.log(response.data); // Registra la respuesta del servidor
            obtener();
            return response.data.cliente; // Devuelve el cliente activado
        } catch (error) {
            console.error('Error al activar cliente:', error);
            throw error;
        }
    };

    const desactivarCliente = async (clienteId) => {
        try {
            const response = await axios.put(`cliente/inactivar/${clienteId}`);
            console.log(response.data); 
            obtener();
            return response.data.cliente;
        } catch (error) {
            console.error('Error al desactivar cliente:', error);
            throw error;
        }
    };

    return {
        datosData,
        obtener,
        agregarCliente,
        activarCliente,
        desactivarCliente
    };
});

