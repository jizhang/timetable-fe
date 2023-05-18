import { createRouter, createWebHashHistory } from 'vue-router'
import Event from '@/views/Event.vue'
import Login from '@/views/Login.vue'

const routes = [
  { path: '/', component: Event },
  { path: '/login', component: Login },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
