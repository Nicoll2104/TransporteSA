import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useVendedorStore = defineStore("vendedor", () => {
    const datosData = ref([])

    const obtener = async () => {
        try {
            const response = await axios.get("vendedor/vendedores");
            datosData.value = response.data;
            return response.data; 
        } catch (error) {
            console.error('Error al obtener los vendedores:', error);
            throw error;
        }
    };

    const agregarVendedor = async (nuevoVendedor) => {
        try {
            const response = await axios.post("vendedor/agregar", nuevoVendedor);
            return response.data;
        } catch (error) {
            console.error('Error al agregar al vendedor:', error);
            throw error;
        }
    };

    const editarVendedor = async (vendedorEditado) => {
        try {
            const response = await axios.put(`vendedor/modificar/${vendedorEditado._id}`, vendedorEditado);
            console.log(response.data);
            obtener();
        } catch (error) {
            console.error('Error al editar el vendedor:', error);
            throw error;
        }
    };

    const activarVendedor = async (vendedorId) => {
        try {
            const response = await axios.put(`vendedor/activar/${vendedorId}`);
            /* console.log(response.data);  */
            obtener();
            return response.data.vendedores;
        } catch (error) {
            console.error('Error al activar al vendedor:', error);
            throw error;
        }
    };

    const desactivarVendedor = async (vendedorId) => {
        try {
            const response = await axios.put(`vendedor/inactivar/${vendedorId}`);
            /* console.log(response.data);   */
            obtener();
            return response.data.vendedores;
        } catch (error) {
            console.error('Error al desactivar al vendedor:', error);
            throw error;
        }
    }; 

    const login = async(data)=>{
        try {
            const response = await axios.login("vendedor/login",data)

            return response
        } catch (error) {
            
        }
    }

    return {
        datosData,
        obtener,
        agregarVendedor,
        editarVendedor,
        activarVendedor,
        desactivarVendedor, 
        login
    };

});