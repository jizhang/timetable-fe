import { createRouter, createWebHashHistory } from 'vue-router'
import Event from '@/views/Event.vue'
import Login from '@/views/Login.vue'
import { routerHolder } from '@/common/utils'

const routes = [
  { path: '/', component: Event },
  { path: '/login', component: Login },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

routerHolder.router = router

export default router
