import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/welcome.vue'
import Users from '../components/user/users.vue'
import Rights from '../components/power/rights.vue'
import Roles from '../components/power/roles.vue'
import Cate from '../components/goods/cate.vue'
import Params from '../components/goods/params.vue'
import List from '../components/goods/list.vue'
import Add from '../components/goods/add.vue'
import Orders from '../components/orders/orders.vue'
import Report from '../components/report/report.vue'
import Shop from '../components/shop/shop.vue'
import Detail from '../components/shop/detail.vue'
import Cart from '../components/shop/cart.vue'
import Index from '../components/shop/index.vue'
import Register from '../components/shop/register.vue'
import UserLogin from '../components/shop/login.vue'
import My from '../components/shop/my.vue'
import Pay from '../components/shop/pay.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/shop'
    },
    {
        path: '/index',
        component: Index,
        redirect: 'shop',
        children: [
            { path: '/shop', component: Shop },
            { path: '/detail/:id?', component: Detail },
            { path: '/cart', component: Cart },
            { path: '/register', component: Register },
            { path: '/userlogin', component: UserLogin },
            { path: '/my', component: My },
            { path: '/pay', component: Pay }
        ]
    },
    // {
    //     path: '/shop',
    //     component: Shop
    // },
    // {
    //     path: '/detail/:id?',
    //     name: 'detail',
    //     component: Detail
    // },
    {
        path: '/cart',
        name: 'cart',
        component: Cart
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        redirect: '/shop',
        children: [
            { path: '/welcome', component: Welcome },
            { path: '/users', component: Users },
            { path: '/rights', component: Rights },
            { path: '/roles', component: Roles },
            { path: '/categories', component: Cate },
            { path: '/params', component: Params },
            { path: '/goods', component: List },
            { path: '/goods/add', component: Add },
            { path: '/orders', component: Orders },
            { path: '/reports', component: Report }
        ]
    }
]

const router = new VueRouter({
    routes
})

// router.beforeEach((to, from, next) => {
//     if (to.path === '/login') {
//         next()
//     }
//     const token = window.sessionStorage.getItem('token')
//     if (!token) {
//         next('/login')
//     }
//     next()
// })

export default router