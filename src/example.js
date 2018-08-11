import Vue from 'Vue';
import cron from './index.js';
Vue.use(cron);
import app from './app.vue';

window.onload = () => {
    new Vue({
        name: 'app',
        el: '#app',
        render(h){
            return h(app);
        }
    });
};