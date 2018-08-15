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

const cron = Vue => {
    Vue.mixin({
        mounted(){
            if (this.$options.cron !== undefined){
                mapOrSingle(this.$options.cron, createTimer.bind(this));
            }

            this.$cron = {
                stop: method => {
                    let locatedCronMethod = false;
                    mapOrSingle(this.$options.cron, cron => {
                        if (cron['method'] === method){
                            locatedCronMethod = true;
                            clearInterval(this._cron[cron['method']].timer);
                            this._cron[cron['method']].timerRunning = false;
                        }
                    });
                    if (!locatedCronMethod){
                        throw new Error(`Cron method '${cron['method']}' does not exist and cannot be stopped.`);
                    }
                },
                start: method => {
                    let locatedCronMethod = false;
                    mapOrSingle(this.$options.cron, cron => {
                        if (cron['method'] === method){
                            locatedCronMethod = true;
                            createTimer.call(this, cron);
                        }
                    });
                    if (!locatedCronMethod){
                        throw new Error(`Cron method '${cron['method']}' does not exist and cannot be started.`);
                    }
                },
            };
        },
        beforeDestroy(){
            for(const prop in this._cron){
                if(this._cron[prop] !== undefined){
                    clearInterval(this._cron[prop].timer);
                }
            }
        }
    });
};

export default cron;