<template>
  <div class="container">
    <div class="container2">
      <div class="logo"><img src="https://static.vecteezy.com/system/resources/thumbnails/007/794/726/small/travel-bus-illustration-logo-on-light-background-free-vector.jpg" alt=""> </div>
      <p   class="titulo"> Transporte</p>
      <div class="contenedor_input">
        <input type="text"     name="email"    id="email"     class="input" placeholder="Nombre de usuario"
          v-model="usuario" />
        <br>
        <input type="password" name="password" id="password"  class="input" placeholder="Contraseña"
          v-model="contrasena" />
        <br>
        <q-btn flat class="btn" label="Acceder" type="submit" color="white" @click="acceder()" :loading="loading" />
        <p class="forgotten"> Olvidaste tus datos ? <a href="#">ayuda para iniciar sesión.</a> </p>
      </div>
    </div>
  </div>
</template>


<script setup>
import { useVendedorStore } from "../stores/vendedor.js";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const useVendedor = useVendedorStore();
const usuario = ref("");
const contrasena = ref("");
const loading = ref(false);

const acceder = async () => {
  try {
    loading.value = true;
    const res = await useVendedor.login({
      usuario: usuario.value,
      contrasena: contrasena.value,
    });
    console.log("Respuesta del servidor:", res);
    if (res.status == 200) {
      router.push("/home");
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
  } finally {
    loading.value = false;
  }
};


</script>


<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.container2 {
  width: 100%;
  max-width: 400px;
  text-align: center;
  border-radius: 10px;
  background-color: rgba(5, 64, 124, 0.377);
  border: 1px solid #ccc; 
  box-shadow: 0 15px 20px 0 rgba(0, 0, 0, 0.568);
  padding: 20px; 
}

.logo img {
  border-radius: 50%;
  width: 40%;
}

.titulo {
  display: grid;
  font-size: 60px; 
  text-align: center;
  color: #fff; 
  justify-content: center;
}

.contenedor_input {
  display: grid;
  gap: 10px; 
}

.input {
  background-color: #ffffff;
  width: 100%;
  height: 40px;
  padding: 10px;
  /* text-align: center; */
  border: 2px solid white;
  border-radius: 5px;
  box-shadow: 3px 3px 2px rgba(70, 70, 69, 0.726);
}

.input:focus {
  color: rgba(202, 199, 199, 0.849);
  background-color: #212121;
  outline-color: rgb(191, 194, 194);
  box-shadow: -3px -3px 15px rgb(196, 197, 197);
  transition: .1s;
  transition-property: box-shadow;
}

.forgotten {
  text-align: center;
  font-size: 0.8rem;
  color: rgb(255, 255, 255);
  margin: 15px 0;
}

.btn {
  --border-color: linear-gradient(-45deg, #2673bf, #4289ed, #00fffb);
  --border-width: 0.125em;
  --curve-size: 0.5em;
  --blur: 30px;
  --bg: #292525;
  --color: #000000;
  color: var(--color);
  position: relative;
  isolation: isolate;
  display: inline-grid;
  place-content: center;
  padding: 0.5em 1.5em;
  font-size: 17px;
  border: 0;
  text-transform: uppercase;
  box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.6);
  clip-path: polygon(
    0% var(--curve-size),
    var(--curve-size) 0,

    100% 0,
    100% calc(100% - var(--curve-size)),
    calc(100% - var(--curve-size)) 100%,

    0 100%
  );
  transition: color 250ms;
}

.btn::after,
.btn::before {
  content: "";
  position: absolute;
  inset: 0;
}

.btn::before {
  background: var(--border-color);
  background-size: 300% 300%;
  animation: move-bg7234 5s ease infinite;
  z-index: -2;
}

@keyframes move-bg7234 {
  0% {
    background-position: 31% 0%;
  }

  50% {
    background-position: 70% 100%;
  }

  100% {
    background-position: 31% 0%;
  }
}

.btn::after {
  background: var(--bg);
  z-index: -1;
  clip-path: polygon(
    /* Top-left */ var(--border-width)
      calc(var(--curve-size) + var(--border-width) * 0.5),
    calc(var(--curve-size) + var(--border-width) * 0.5) var(--border-width),
    /* top-right */ calc(100% - var(--border-width)) var(--border-width),
    calc(100% - var(--border-width))
      calc(100% - calc(var(--curve-size) + var(--border-width) * 0.5)),
    /* bottom-right 1 */
      calc(100% - calc(var(--curve-size) + var(--border-width) * 0.5))
      calc(100% - var(--border-width)),
    /* bottom-right 2 */ var(--border-width) calc(100% - var(--border-width))
  );
  transition: clip-path 500ms;
}

.btn:where(:hover, :focus)::after {
  clip-path: polygon(
    /* Top-left */ calc(100% - var(--border-width))
      calc(100% - calc(var(--curve-size) + var(--border-width) * 0.5)),
    calc(100% - var(--border-width)) var(--border-width),
    /* top-right */ calc(100% - var(--border-width)) var(--border-width),
    calc(100% - var(--border-width))
      calc(100% - calc(var(--curve-size) + var(--border-width) * 0.5)),
    /* bottom-right 1 */
      calc(100% - calc(var(--curve-size) + var(--border-width) * 0.5))
      calc(100% - var(--border-width)),
    /* bottom-right 2 */
      calc(100% - calc(var(--curve-size) + var(--border-width) * 0.5))
      calc(100% - var(--border-width))
  );
  transition: 200ms;
}

.btn:where(:hover, :focus) {
  color: #fff;
}




/* Responsividad */
@media (max-width: 300px) {
  .titulo {
    font-size: 30px;
    font-weight: 700;
  }

  .logo img {
  border-radius: 50%;
  width: 65%;
}

  .input {
    padding: 8px;
  }
}
</style>

