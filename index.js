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
    const method = cron.method;

    if(this._cron[method] && this._cron[method].timerRunning) return;

    if(cron.autoStart === false){
        this._cron[method] = { timerRunning: false };
    }
    else{
        this._cron[method] = {
            timer: setInterval(() => {
                this.$options.methods[method].call(this);
                this._cron[method].lastInvocation = + new Date();
            }, cron.time),
            timerRunning: true,
            time: cron.time,
            lastInvocation: + new Date()
        };
    }
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
                        if (cron.method === method){
                            locatedCronMethod = true;

                            if(!this._cron[cron.method].timerRunning) return;

                            clearInterval(this._cron[cron.method].timer);
                            this._cron[cron.method].timerRunning = false;
                        }
                    });
                    if (!locatedCronMethod){
                        throw new Error(`Cron method '${method}' does not exist and cannot be stopped.`);
                    }
                },
                start: method => {
                    let locatedCronMethod = false;
                    mapOrSingle(this.$options.cron, cron => {
                        if (cron.method === method){
                            locatedCronMethod = true;
                            createTimer.call(this, { ...cron, autoStart: true });
                        }
                    });
                    if (!locatedCronMethod){
                        throw new Error(`Cron method '${method}' does not exist and cannot be started.`);
                    }
                },
                restart: method =>{
                    this.$cron.stop(method);
                    this.$cron.start(method);
                },
                time: (method, time) => {
                    const currentDate = + new Date();

                    if(!this._cron[method].timerRunning){
                        this._cron[method].lastInvocation = currentDate;
                    }
                    const elapsed = currentDate - this._cron[method].lastInvocation;

                    this.$cron.stop(method);

                    if(elapsed > time){
                        this.$options.methods[method].call(this);
                        createTimer.call(this, { method, time});
                    }
                    else{
                        setTimeout(() => {
                            this.$options.methods[method].call(this);
                            createTimer.call(this, { method, time});
                        }, time - elapsed);
                    }
                }
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