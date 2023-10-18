import login from "../components/login.vue"
import home from "../components/home.vue"
import clientes from "../components/clientes.vue"
import  menu  from "../components/menu.vue";
import {createRouter, createWebHashHistory} from "vue-router"

const routes = [
    {path: "/", component: login},
    {path: "/menu",component: menu,
    children: [
      { path: "", redirect: "/menu" },
      { path: "/home", component: home },
      { path: "/clientes", component: clientes }
    ]}
]

export const router = createRouter({
    history:createWebHashHistory(),
    routes
})