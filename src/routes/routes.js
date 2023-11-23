import login from "../components/login.vue";
import home from "../components/home.vue";
import clientes from "../components/clientes.vue";
import menu from "../components/menu.vue";
import bus from "../components/bus.vue";
import conductor from "../components/conductor.vue";
import ruta from "../components/ruta.vue";
import vendedor from "../components/vendedor.vue";
import boleto from "../components/boleto.vue";
import ventas from "../components/ventas.vue";
import { createRouter, createWebHashHistory } from "vue-router";

function isAuthenticated() {
  const token = localStorage.getItem("token");

  console.log(token);

  if (token) return true;
  else return false;
}

const authGuard = (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    console.log(isAuthenticated());
    if (!isAuthenticated()) {
      next({ path: "/" });
      console.log("h");
    } else {
      next();
      console.log("a");
    }
  } else {
    next();
    console.log("b");
  }
};

const routes = [
  { path: "/", component: login },
  {
    path: "/menu",
    meta: { requiresAuth: true },
    beforeEnter: authGuard,
    component: menu,
    children: [
      { path: "", redirect: "/menu" },
      { path: "/home", component: home },
      {
        path: "/clientes",
        meta: { requiresAuth: true },
        beforeEnter: authGuard,
        component: menu,
        component: clientes,
      },
      { path: "/bus", component: bus },
      { path: "/conductor", component: conductor },
      { path: "/vendedor", component: vendedor },
      { path: "/ruta", component: ruta },
      { path: "/boleto", component: boleto },
      { path: "/ventas", component: ventas },
    ],
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
