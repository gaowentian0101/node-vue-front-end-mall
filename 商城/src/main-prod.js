import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import ZkTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import nprogress from 'nprogress'

// axios
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8000/api/private/v1/'
axios.interceptors.request.use((config) => {
    nprogress.start()
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
axios.interceptors.response.use(config => {
    nprogress.done()
    return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('table-tree', ZkTable)

Vue.use(VueQuillEditor)

Vue.filter('dateFormat', function(originVal) {
    const dt = new Date(originVal)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')
    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  })

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')