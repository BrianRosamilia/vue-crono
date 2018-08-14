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
    this._cron = this._cron || {};
    const method = cron['method'];

    if(this._cron[method] && this._cron[method].timerRunning) return;

    this._cron[method] = {
        timer: setInterval(() => {
            this.$options.methods[method].call(this);
        }, cron.time),
        timerRunning: true
    };
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
    let locatedCronMethod = false;
    mapOrSingle(this.$options.cron, cron => {
        if (cron['method'] === method){
            locatedCronMethod = true;
            clearInterval(this._cron[cron['method']].timer);
            this._cron[cron['method']].timerRunning = false;
        }
    });
    if(!locatedCronMethod){
        throw new Error(`Cron method '${cron['method']}' does not exist and cannot be stopped.`);
    }
};

Vue.prototype.$cron.start = function(method){
    let locatedCronMethod = false;
    mapOrSingle(this.$options.cron, cron => {
        if (cron['method'] === method){
            locatedCronMethod = true;
            createTimer.call(this, cron);
        }
    });
    if(!locatedCronMethod){
        throw new Error(`Cron method '${cron['method']}' does not exist and cannot be started.`);
    }
};

export default cron;