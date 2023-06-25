import { createApp } from 'vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import pinia from './stores'
import router from './router'
import App from './App.vue'

dayjs.extend(customParseFormat)

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
