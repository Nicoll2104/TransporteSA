import login from "../components/login.vue"
import home from "../components/home.vue"
import clientes from "../components/clientes.vue"
import  menu  from "../components/menu.vue";
import bus from "../components/bus.vue";
import conductor from "../components/conductor.vue";
import {createRouter, createWebHashHistory} from "vue-router"

const routes = [
    {path: "/", component: login},
    {path: "/menu",component: menu,
    children: [
      { path: "", redirect: "/menu" },
      { path: "/home", component: home },
      { path: "/clientes", component: clientes },
      { path: "/bus", component: bus},
      {path: "/conductor", component: conductor}
    ]}
]

export const router = createRouter({
    history:createWebHashHistory(),
    routes
})