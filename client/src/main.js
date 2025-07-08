import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'

import { createWebHistory, createRouter } from 'vue-router'

const routes = [
    { name: 'root', path: '/', component: () => import('@/views/main/main.vue') },
    {
        path: '/404',
        name: 'NotFound',
        component: () => import('@/views/404/404.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/404'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
