import Vue from 'vue';

const mapOrSingle = function(obj, fn){
    if(obj.constructor !== Array){
        return fn(obj);
    }
    else{
        return obj.map(fn);
    }
};

const createTimer = function(cron){
    this._cron = {};
    this._cron.timer = setInterval(() => {
        if(this._cron.disabled) return;
        this.$options.methods[cron['method']].call(this);
    }, cron.time);
};

const cron = () => {
    const saveMount = Vue.prototype.$mount;

    Vue.prototype.$mount = function(...allArgs){
        saveMount.call(this, ...allArgs);
        if(this.$options.cron !== undefined){
            mapOrSingle(this.$options.cron, createTimer.bind(this));
        }
    };
};

Object.defineProperty(Vue.prototype, '$cron', { get: function(){ return this } });

Vue.prototype.$cron.stop = function(method){
    mapOrSingle(this.$options.cron, cron => {
        if (cron['method'] === method){
            clearInterval(this._cron.timer);
        }
    });
};

Vue.prototype.$cron.start = function(method){
    mapOrSingle(this.$options.cron, cron => {
        if (cron['method'] === method){
            createTimer.call(this, cron);
        }
    });
};

export default cron;