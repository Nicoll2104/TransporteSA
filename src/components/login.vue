<template>
  <div class="container">
    <div class="hero">
      <form action="" class="form">
        <div class="imagenLogo"></div>
        <div class="logo">Transporte</div>

        <input
          type="text"
          name="email"
          id="email"
          required=""
          class="input"
          placeholder="Nombre de usuario"
          v-model="usuario"
        />
        <input
          type="password"
          name="password"
          id="password"
          required=""
          class="input"
          placeholder="Contraseña"
          v-model="contrasena"
        />

        <button class="btn" type="submit" @click="acceder()">
          Acceder
        </button>
        <p class="forgotten">
          Olvidaste tus datos ?
          <a href="#">ayuda para iniciar sesión.</a>
        </p>
      </form>
    </div>
  </div>
</template>


<script setup>
import {useVendedorStore} from "../stores/vendedor.js"
import {ref} from 'vue'

const useVendedor = useVendedorStore()
const usuario = ref("")
const contrasena = ref("")

const acceder = async()=>{
  const res = await useVendedor.login({usuario: usuario.value, contrasena: contrasena.value})
  console.log(res);
}

</script>


<style scoped>
.container {
  height: 100%;
  width: 100%;
}

.hero {
  padding: 60px 20px;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("../assets/4931029.jpg");
  background-size: cover;
}

.form {
  display: flex;
  width: 500px;
  height: 65%;
  background-color: #1976d28c;
  flex-direction: column;
  box-shadow: 20px 17px 50px rgb(90, 88, 88);
  border-radius: 15px;
  font-size: 1rem;
  align-items: center;
}

.input {
  margin-bottom: 20px;
  border-radius: 10px;
  display: block;
  width: 70%;
  height: 10%;
  border: none;
  outline: none;
  color: rgb(161, 161, 161);
  font-size: inherit;
}

.logo {
  font-size: 40px;
  color: rgb(255, 255, 255);
  font-weight: 600;
  margin: 10px;
}

.imagenLogo {
  margin: 10px;
  border-radius: 20%;
  background-image: url(https://static.vecteezy.com/system/resources/thumbnails/007/794/726/small/travel-bus-illustration-logo-on-light-background-free-vector.jpg);
  background-size: cover;
  width: 32%;
  height: 22%;
}

::placeholder {
  color: rgb(161, 161, 161);
  padding: 0% 5%;
}

.forgotten {
  text-align: center;
  font-size: 0.8rem;
  width: 80%;
  color: rgb(255, 255, 255);
  margin: 15px 0;
}

a {
  color: inherit;
  font-weight: bold;
  text-decoration: none;
}

.btn {
  --border-color: linear-gradient(-45deg, #2673bf, #4289ed, #00fffb);
  --border-width: 0.125em;
  --curve-size: 0.5em;
  --blur: 30px;
  --bg: #ffffff;
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

@media (max-width: 400px) {
  .form {
    height: 100%;
    width: 100%;
  }
}
</style>
