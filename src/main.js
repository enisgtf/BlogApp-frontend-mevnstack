import { createApp, watch } from 'vue'
import { storeToRefs } from 'pinia';
import { useStore } from "./store/store.js"
import { createPinia } from 'pinia'
import router from './router/router'
import App from './App.vue'
import axios from 'axios'

/* creating app */
const app = createApp(App)

/* creating pinia store */
const pinia = createPinia()
app.use(pinia)

/* using router */
app.use(router)

/* app mounting */
app.mount('#app')


/* axios api config */
axios.defaults.baseURL = 'https://blogapp-mevnstack-enisgtf.onrender.com/api/v1'

// watching currentToken in store for sending on req.headers
const store = useStore()
const { currentToken } = storeToRefs(store)
watch(currentToken, () => {
    axios.defaults.headers.Authorization = currentToken.value
})




