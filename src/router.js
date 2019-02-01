import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

//

//export default new Router({
export const routes = [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('./views/About.vue')
        }
    ]
//})
