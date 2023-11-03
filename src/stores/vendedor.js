import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { Notify } from 'quasar';

export const useVendedorStore = defineStore("vendedor", () => {
    const datosData = ref([]);
    const loading = ref(false);

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
        loading.value = true
        try {
            const response = await axios.put(`vendedor/activar/${vendedorId}`);
            Notify.create({
                type: "positive",
                color: "green", 
                message: "Vendedor Activado",
            });
            obtener();
            return response.data.vendedores;
        } catch (error) {
            console.error('Error al activar al vendedor:', error);
            Notify.create({
                type: "negative",
                color: "primary",
                message: error.response.data.errors[0].msg,
            });
        } finally {
            loading.value = false
        }
    };

    const desactivarVendedor = async (vendedorId) => {
        loading.value = true
        try {
            const response = await axios.put(`vendedor/inactivar/${vendedorId}`);
            Notify.create({
                type: "positive",
                color: "red", 
                message: "Vendedor Desactivado",
            });
            obtener();
            return response.data.vendedores;
        } catch (error) {
            console.error('Error al desactivar al vendedor:', error);
            Notify.create({
                type: "negative",
                color: "primary",
                message: error.response.data.errors[0].msg,
            });
        } finally {
            loading.value = false
        }
    }; 

    const login = async (data) => {
        loading.value = true;
        try {
          const response = await axios.post("vendedor/login", data);
          console.log(data);
          Notify.create({
            type: "positive",
            color: "green",
            message: "Inicio sesión exitosamente.",
          });
          return response;
        } catch (error) {
          console.error("Error al iniciar sesión:", error);
          Notify.create({
            type: "negative",
            color: "red",
            message: "Error al iniciar sesión. Por favor, verifica su usuario y contraseña",
          });
        } finally {
          loading.value = false;
        }
      };
      

    return {
        datosData,
        loading,
        obtener,
        agregarVendedor,
        editarVendedor,
        activarVendedor,
        desactivarVendedor, 
        login
    };

});