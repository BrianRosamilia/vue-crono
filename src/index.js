import Vue from 'vue';

const mapOrSingle = function(obj, fn){
    if(obj.constructor !== Array){
        return fn(obj);
    }
    else{
        return obj.map(fn);
    }
};

const cron = () => {
    const saveMount = Vue.prototype.$mount;

    Vue.prototype.$mount = function(...allArgs){
        saveMount.call(this, ...allArgs);
        if(this.$options.cron !== undefined){
            mapOrSingle(this.$options.cron, cron => {
                cron._cron = {};
                cron._cron.timer = setInterval(() => {
                    if(cron._cron.disabled) return;
                    this.$options.methods[cron['method']].call(this);
                }, cron.time);
            });
        }
    };
};

Vue.prototype.$cron = {
    stop(component, method){
        mapOrSingle(component.$options.cron, cron => {
            if (cron['method'] === method){
                cron._cron.disabled = true;
            }
        });
    },
    start(component, method){
        mapOrSingle(component.$options.cron, cron => {
            if (cron['method'] === method){
                cron._cron.disabled = false;
            }
        });
    }
};

export default cron;