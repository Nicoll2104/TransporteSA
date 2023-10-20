<template>

    <div class="padre">
      <div class="card"><router-link to="/"><img src="https://cdn-icons-png.flaticon.com/128/1176/1176434.png" style="height: 150px; width: 150px;"> <br> Cerrar sesión</router-link></div>     
      <div class="card"><router-link to="/conductor"><img src="https://cdn-icons-png.flaticon.com/128/2684/2684218.png" style="height: 150px; width: 150px;"> <br>Conductores</router-link></div>
      <div class="card"><router-link to="/"><img src="https://cdn-icons-png.flaticon.com/128/3859/3859309.png" style="height: 150px; width: 150px;"> <br>Vendedores</router-link></div>
      <div class="card"><router-link to="/bus"><img src="https://cdn-icons-png.flaticon.com/128/9830/9830829.png" style="height: 150px; width: 150px;"> <br>Buses</router-link></div>
      <div class="card"><router-link to="/ruta"><img src="https://cdn-icons-png.flaticon.com/128/3124/3124383.png" style="height: 150px; width: 150px;"> <br>Rutas</router-link></div>
      <div class="card"><router-link to="/clientes"><img src="https://cdn-icons-png.flaticon.com/128/3201/3201521.png" style="height: 150px; width: 150px;"> <br> Clientes</router-link></div>
      <div class="card"><router-link to="/"><img src="https://cdn-icons-png.flaticon.com/128/6030/6030250.png" style="height: 150px; width: 150px;"> <br>Tiquetes</router-link></div>
      <div class="card"><router-link to="/"><img src="https://cdn-icons-png.flaticon.com/128/1019/1019607.png" style="height: 150px; width: 150px;"> <br>Ventas</router-link></div>
    </div>

  

  </template>
    
    <script>
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
  color: #1976d2;
  }
  
  .card {
    box-sizing: border-box;
    width: 240px;
    height: 254px;
    background: rgba(242, 240, 240, 0.58);
    border: 1px solid white;
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
  }
  
  .card:active {
    transform: scale(0.95) rotateZ(1.7deg);
  }
  
  </style>