<template>
    <div class="padre">   
      <div class="card"><router-link to="/conductor"><img src="https://cdn-icons-png.flaticon.com/128/2684/2684218.png" style="height: 150px; width: 150px;"> <br>Conductores</router-link></div>
      <div class="card"><router-link to="/vendedor"><img src="https://cdn-icons-png.flaticon.com/128/3859/3859309.png" style="height: 150px; width: 150px;"> <br>Vendedores</router-link></div>
      <div class="card"><router-link to="/bus"><img src="https://cdn-icons-png.flaticon.com/128/9830/9830829.png" style="height: 150px; width: 150px;"> <br>Buses</router-link></div>
      <div class="card"><router-link to="/ruta"><img src="https://cdn-icons-png.flaticon.com/128/3124/3124383.png" style="height: 150px; width: 150px;"> <br>Rutas</router-link></div>
      <div class="card"><router-link to="/clientes"><img src="https://cdn-icons-png.flaticon.com/128/3201/3201521.png" style="height: 150px; width: 150px;"> <br> Clientes</router-link></div>
      <div class="card"><router-link to="/ventas"><img src="https://cdn-icons-png.flaticon.com/128/1019/1019607.png" style="height: 150px; width: 150px;"> <br>Ventas</router-link></div>
      <div class="card"><router-link to="/boleto"><img src="https://cdn-icons-png.flaticon.com/128/6030/6030250.png" style="height: 150px; width: 150px;"> <br>Tiquetes</router-link></div>
      <div class="card" @click="cerrarSesion"><router-link to="/"><img src="https://cdn-icons-png.flaticon.com/128/1176/1176434.png" style="height: 150px; width: 150px;"> <br> Cerrar sesión</router-link></div>  
    </div>
  </template>
    
    <script setup>
  const cerrarSesion = () => {
    console.log("Cerrando sesión...");
    localStorage.removeItem('token');
    localStorage.removeItem('vendedor');
  };
  </script>
  
  
  <style scoped>

  .padre {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 80px;
    padding: 6%;
  }

  .padre a{
    text-decoration: none;
    color: #000000;
  }
  
  .card {
    box-sizing: border-box;
    width: 240px;
    height: 254px;
    background: rgba(255, 255, 255, 0);
    border: 1px solid rgb(0, 136, 255);
    box-shadow: 2px 7px 11px rgba(0, 0, 0, 0.22);
    backdrop-filter: blur(6px);
    border-radius: 17px;
    text-align: center;
    cursor: pointer;
    transition: all 0.5s;
    display: flex;
    user-select: none;
    font-weight: bolder;
    color: black;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}
  
  .card:hover {
    border: 1px solid black;
    transform: scale(1.05);
    background-color: rgb(0, 136, 255);
  }
  
  .card:active {
    transform: scale(0.95) rotateZ(1.7deg);
  }
  
  </style>