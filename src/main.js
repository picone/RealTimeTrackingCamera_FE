import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import App from './App.vue'
import ElementUI from 'element-ui'

Vue.use(VueRouter);
Vue.use(ElementUI);

const router = new VueRouter({
    routes
});
const app = new Vue({
    el: '#app',
    router,
    render(h) {
        return h(App)
    }
});
