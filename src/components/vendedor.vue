<template>
    <div class="q-pa-md">
        <div class="title"><h3>Datos Vendedores</h3>

<div class="raya"></div>
</div><br><br>

<div class="agre"><q-btn label="Agregar" color="blue" @click="modal = true" /></div><br><br>

        <q-table title="DATOS VENDEDORES" :rows="rows" :columns="columns" row-key="cedula" class="tableRT">
            <template v-slot:body-cell-status="props">
                <q-td key="status" :props="props">
                    <span class="color1" v-if="props.row.status == 1">Activo</span>
                    <span class="color2" v-else>Inactivo</span>
                </q-td>
            </template>
            <template v-slot:body-cell-acciones="props">
                <q-td key="acciones" :props="props">
                    <q-btn class="btnEditar" icon="edit" color="blue" @click="editarVendedor(props.row)"></q-btn>
                    <q-btn class="btnActivar" v-if="props.row.status == 1" @click="desactivar(props.row._id)">❌</q-btn>
                    <q-btn class="btnActivar" v-else @click="activar(props.row._id)">✅</q-btn>
                </q-td>
            </template>

        </q-table>
        <q-dialog v-model="modal">
            <q-card>

                <q-card-section class="arri">
          <div class="text-h6">DATOS DE VENDEDORES</div>
        </q-card-section>

                <q-separator />

                <q-card-section>
                    <div class="infoDatos">
                        <div class="ilDatos">
                            <label class="labelDatos" for="cedula"> Cedula:</label>
                            <input class="inputDatos" type="number" id="cedula" v-model="cedula" />
                        </div>

                        <div class="ilDatos">
                            <label class="labelDatos" for="nombre">Nombre:</label>
                            <input class="inputDatos" type="text" id="nombre" v-model="nombre" />
                        </div>

                        <div class="ilDatos">
                            <label class="labelDatos" for="apellido">Apellido:</label>
                            <input class="inputDatos" type="text" id="apellido" v-model="apellido" />
                        </div>

                        <div class="ilDatos">
                            <label class="labelDatos" for="telefono">Telefono:</label>
                            <input class="inputDatos" type="number" id="telefono" v-model="telefono" />
                        </div>

                        <div class="ilDatos">
                            <label class="labelDatos" for="usuario">Usuario:</label>
                            <input class="inputDatos" type="text" id="usuario" v-model="usuario" />
                        </div>

                        <div class="ilDatos">
                            <label class="labelDatos" for="contrasena">Contraseña:</label>
                            <input class="inputDatos" type="password" id="contrasena" v-model="contrasena" />
                        </div>

                    </div>
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">

                    <q-btn flat label="Cerrar" 
                    color="white" @click="limpiar" 
                    class="btnc"
                    v-close-popup />

                    <q-btn flat label="Aceptar" 
                    color="white" @click="agregarEditarVendedor" 
                    class="btna"
                    v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
        

    </div>
</template>
    
<script setup>
import { onMounted, ref } from "vue";
import { useVendedorStore } from "../stores/vendedor.js";
import { useQuasar } from 'quasar'

const vendedorStore = useVendedorStore()

const modal = ref(false)
const rows = ref([]);
const nombre = ref("");
const apellido = ref("");
const cedula = ref("");
const telefono = ref("");
const usuario = ref("");
const contrasena = ref("");
const vendedorEditando = ref(null);
const $q = useQuasar()

const columns = [
    { name: "cedula", required: true, label: "Cedula", align: "center", field: "cedula", sortable: true },
    { name: "nombre", required: true, label: "Nombre", align: "center", field: "nombre", sortable: true },
    { name: "apellido", required: true, label: "Apellido", align: "center", field: "apellido", sortable: true },
    { name: "telefono", required: true, label: "Telefono", align: "center", field: "telefono", sortable: true },
    { name: "usuario", required: true, label: "Usuario", align: "center", field: "usuario", sortable: true },
    { name: "status", label: "Estado", align: "center", field: "status", sortable: true },
    { name: "acciones", required: true, label: "Acciones", align: "center", field: "acciones", },
];

async function obtenerVendedor() {
    try {
        const Vendedores = await vendedorStore.obtener();
        console.log('Vendedores obtenidos:', Vendedores);
        rows.value = vendedorStore.datosData;
    } catch (error) {
        console.error('Error al obtener los Vendedores:', error);
    }
}

const agregarEditarVendedor = async () => {
    if (vendedorEditando.value) {
        const vendedorEditado = {
            _id: vendedorEditando.value._id,
            cedula: cedula.value,
            nombre: nombre.value,
            apellido: apellido.value,
            telefono: telefono.value,
            usuario: usuario.value,
            contrasena: contrasena.value,
        };
        try {
            await vendedorStore.editarVendedor(vendedorEditado);
            cedula.value = "";
            nombre.value = "";
            apellido.value = "";
            telefono.value = "";
            usuario.value = "";
            contrasena.value = "";
            modal.value = false;
            vendedorEditando.value = null;
            $q.notify({
            message: 'Vendedor editado correctamente',
            textColor: 'white',
            type: "positive",
            color: 'green',
            });
            obtenerVendedor();
        } catch (error) {
            console.error('Error al editar el vendedor:', error);
            $q.notify({ type: 'negative', color: 'negative', message: 'Error al editar el vendedor' });
        }
    } else {
        const nuevoVendedor = {
            cedula: cedula.value,
            nombre: nombre.value,
            apellido: apellido.value,
            telefono: telefono.value,
            usuario: usuario.value,
            contrasena: contrasena.value,
        };
        try {
            await vendedorStore.agregarVendedor(nuevoVendedor);
            cedula.value = "";
            nombre.value = "";
            apellido.value = "";
            telefono.value = "";
            usuario.value = "";
            contrasena.value = "";
            modal.value = false;
            $q.notify({
            message: 'Vendedor agregado correctamente',
            textColor: 'white',
            type: "positive",
            color: 'green',
            });
            obtenerVendedor();
            limpiar();
        } catch (error) {
            console.error('Error al agregar el vendedor:', error);
            $q.notify({ type: 'negative', color: 'negative', message: 'Error al agregar el vendedor' });
        }
    }
}

const editarVendedor = (vendedor) => {
    cedula.value = vendedor.cedula;
    nombre.value = vendedor.nombre;
    apellido.value = vendedor.apellido;
    telefono.value = vendedor.telefono;
    usuario.value = vendedor.usuario;
    contrasena.value = vendedor.contrasena;
    vendedorEditando.value = vendedor;
    modal.value = true;
}

const limpiar = () => {
    cedula.value = "";
    nombre.value = "";
    apellido.value = ""
    telefono.value = "";
    usuario.value = "";
    contrasena.value = "";
};

async function activar(id) {
    try {
        const vendedor = await vendedorStore.activarVendedor(id);
        console.log('vendedor activado:', vendedor);
        obtenerVendedor();
    } catch (error) {
        console.error('Error al activar vendedor:', error);
    }
}

async function desactivar(id) {
    try {
        const vendedor = await vendedorStore.desactivarVendedor(id);
        console.log('vendedor desactivado:', vendedor);
        obtenerVendedor();
    } catch (error) {
        console.error('Error al desactivar vendedor:', error);
    }
}

onMounted(() => {
obtenerVendedor()
});

</script>
    
<style scoped>
.q-card {
  display: flex;
  width: 100%;
  height: 60%;
  flex-direction: column;
  align-items: center;
}

.btna{
  background-color: #1976d2;
}
.btnc {
  background-color: rgb(210, 25, 25);
}
.inputDatos {
  width: 340px;
  height: 3vh;
  border: none;
  background-color: rgba(241, 233, 233, 0.589);
  border-radius: 10px;
  margin: 8px;
}

.btnEditar {
  margin: 5px;
}

label {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.agre {
  display: flex;
  justify-content: flex-end;
}
.title {
  display: flex;
  flex-direction: column;
  align-items: center;
}
h3 {
  font-weight: bold;
}

.raya {
  background-color: rgba(50, 107, 253, 0.85);
  width: 50%;
  height: 5px;
}

.arri {
  display: flex;
  justify-content: center;
  background-color: #1976d2;
  color: #ffffff;
  width: 100%;
}
</style>