import Vue from 'Vue';
import crono from './index.js';
Vue.use(crono);
import app from './bootstrap.vue';

window.onload = () => {
    new Vue({
        name: 'app',
        el: '#app',
        render(h){
            return h(app);
        }
    });
};