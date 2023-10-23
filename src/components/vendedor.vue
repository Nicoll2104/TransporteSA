<template>
    <div class="q-pa-md">
        <q-table title="DATOS VENDEDORES" :rows="rows" :columns="columns" row-key="cedula" class="tableRT">
            <template v-slot:body-cell-status="props">
                <q-td key="status" :props="props">
                    <span class="color1" v-if="props.row.status == 1">Activo</span>
                    <span class="color2" v-else>Inactivo</span>
                </q-td>
            </template>
            <template v-slot:body-cell-acciones="props">
                <q-td key="acciones" :props="props">
                    <q-btn class="btnEditar" icon="edit" color="amber" @click="editarVendedor(props.row)"></q-btn>
                    <q-btn class="btnActivar" v-if="props.row.status == 1" @click="desactivar(props.row._id)">❌</q-btn>
                    <q-btn class="btnActivar" v-else @click="activar(props.row._id)">✅</q-btn>
                </q-td>
            </template>

        </q-table>
        <q-dialog v-model="modal">
            <q-card>
                <q-card-section>
                    <div class="text-h6">DATOS DE VENDEDOR</div>
                </q-card-section>

                <q-separator />

                <q-card-section style="max-height: 50vh" class="scroll">
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
                    <q-btn flat label="Cerrar" color="primary" @click="limpiar" v-close-popup />
                    <q-btn flat label="Aceptar" color="primary" @click="agregarEditarVendedor" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <q-btn label="Agregar" color="primary" @click="modal = true" />

    </div>
</template>
    
<script setup>
import { onMounted, ref } from "vue";
import { useVendedorStore } from "../stores/vendedor.js";

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
            obtenerVendedor();
        } catch (error) {
            console.error('Error al editar el vendedor:', error);
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
            obtenerVendedor();
            limpiar();
        } catch (error) {
            console.error('Error al agregar el vendedor:', error);
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

/* async function AgregarVendedor() {
    const nuevoVendedor = {
        nombre: nombre.value,
        apellido: apellido.value,
        cedula: cedula.value,
        telefono: telefono.value,
        usuario: usuario.value,
        contrasena: contrasena.value,
    };
    console.log("Vendedor agregado:", nuevoVendedor);

    try {
        await vendedorStore.agregarVendedor(nuevoVendedor);

        nombre.value = "";
        apellido.value = "";
        cedula.value = "";
        telefono.value = "";
        usuario.value = "";
        contrasena.value = "";

        modal.value = false;

        obtenerVendedor();
    } catch (error) {
        console.error('Error al agregar un vendedor:', error);
    }
} */

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


const columns = [
    { name: "cedula", required: true, label: "Cedula", align: "left", field: "cedula", sortable: true },
    { name: "nombre", required: true, label: "Nombre", align: "left", field: "nombre", sortable: true },
    { name: "apellido", required: true, label: "Apellido", align: "left", field: "apellido", sortable: true },
    { name: "telefono", required: true, label: "Telefono", align: "left", field: "telefono", sortable: true },
    { name: "usuario", required: true, label: "Usuario", align: "left", field: "usuario", sortable: true },
    { name: "contrasena", required: true, label: "Contraseña", align: "left", field: "contrasena", sortable: true },
    { name: "status", label: "Status", align: "left", field: "status", sortable: true },
    { name: "acciones", required: true, label: "Acciones", align: "center", field: "acciones", },
];

</script>
    
<style scoped>
.color1 {
    color: rgb(136, 226, 0);
}

.color2 {
    color: red;
}

.infoDatos {
    display: flex;
    margin: 0 auto;
    flex-direction: column;
}

.ilDatos {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
}


.labelDatos {
    display: flex;
    align-items: center;
    width: 60px;

}

.inputDatos {
    width: 200px;
    padding: 5px;
}

.btnEditar {
    margin: 5px;
}

label {
    margin-right: 20px;
}
</style>