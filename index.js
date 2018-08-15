'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var mapOrSingle = function mapOrSingle(obj, fn) {
    if (obj.constructor !== Array) {
        return fn(obj);
    } else {
        return obj.map(fn);
    }
};

var createTimer = function createTimer(cron) {
    var _this = this;

    this._cron = this._cron || {};
    var method = cron['method'];

    if (this._cron[method] && this._cron[method].timerRunning) return;

    this._cron[method] = {
        timer: setInterval(function () {
            _this.$options.methods[method].call(_this);
        }, cron.time),
        timerRunning: true
    };
};

var cron = function cron(Vue) {
    Vue.mixin({
        mounted() {
            var _this2 = this;

            if (this.$options.cron !== undefined) {
                mapOrSingle(this.$options.cron, createTimer.bind(this));
            }

            this.$cron = {
                stop: function stop(method) {
                    var locatedCronMethod = false;
                    mapOrSingle(_this2.$options.cron, function (cron) {
                        if (cron['method'] === method) {
                            locatedCronMethod = true;
                            clearInterval(_this2._cron[cron['method']].timer);
                            _this2._cron[cron['method']].timerRunning = false;
                        }
                    });
                    if (!locatedCronMethod) {
                        throw new Error(`Cron method '${cron['method']}' does not exist and cannot be stopped.`);
                    }
                },
                start: function start(method) {
                    var locatedCronMethod = false;
                    mapOrSingle(_this2.$options.cron, function (cron) {
                        if (cron['method'] === method) {
                            locatedCronMethod = true;
                            createTimer.call(_this2, cron);
                        }
                    });
                    if (!locatedCronMethod) {
                        throw new Error(`Cron method '${cron['method']}' does not exist and cannot be started.`);
                    }
                }
            };
        },
        beforeDestroy() {
            for (var prop in this._cron) {
                if (this._cron[prop] !== undefined) {
                    clearInterval(this._cron[prop].timer);
                }
            }
        }
    });
};

exports.default = cron;
