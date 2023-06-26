import { createRouter, createWebHashHistory } from 'vue-router'
import Event from '@/views/Event.vue'
import Login from '@/views/Login.vue'
import Ebbinghaus from '@/views/Ebbinghaus.vue'
import { routerHolder } from '@/common/utils'

const routes = [
  { path: '/', component: Event },
  { path: '/login', component: Login },
  { path: '/ebbinghaus', component: Ebbinghaus },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

routerHolder.router = router

export default router
