import { createApp } from 'vue'
import { createPinia } from 'pinia';
import { Quasar } from 'quasar';
import App from './App.vue'
import { router } from "./routes/routes.js";
import 'quasar/src/css/index.sass';
import axios from 'axios';
import '@quasar/extras/material-icons/material-icons.css'



axios.defaults.baseURL = "https://boleto.onrender.com/api/"


const pinia = createPinia()
const app = createApp(App)

app.use(Quasar, {
    plugins: ['Notify'], 
    config: {
        notify: {
        }
    },
})

app.use(router)
app.mount('#app')
app.use(pinia)
