import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/test0/index/home',
      name: 'Test0Home',
      component: () => import('../views/test0/Home.vue')
    },
    {
      path: '/test/index/home',
      name: 'TestHome',
      component: () => import('../views/test/Home.vue')
    }
  ]
})

export default router 