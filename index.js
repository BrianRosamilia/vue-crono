'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.cleanTime = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _cleanTime = require('./cleanTime.vue');

var _cleanTime2 = _interopRequireDefault(_cleanTime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    var method = cron.method;

    if (this._cron[method] && this._cron[method].timerRunning) return;

    if (cron.autoStart === false) {
        this._cron[method] = { timerRunning: false };
    } else {
        this._cron[method] = {
            timer: setInterval(function () {
                _this.$options.methods[method].call(_this);
                _this._cron[method].lastInvocation = +new Date();
            }, cron.time),
            timerRunning: true,
            time: cron.time,
            lastInvocation: +new Date()
        };
    }
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
                        if (cron.method === method) {
                            locatedCronMethod = true;

                            if (!_this2._cron[cron.method].timerRunning) return;

                            clearInterval(_this2._cron[cron.method].timer);
                            _this2._cron[cron.method].timerRunning = false;
                        }
                    });
                    if (!locatedCronMethod) {
                        throw new Error(`Cron method '${method}' does not exist and cannot be stopped.`);
                    }
                },
                start: function start(method) {
                    var locatedCronMethod = false;
                    mapOrSingle(_this2.$options.cron, function (cron) {
                        if (cron.method === method) {
                            locatedCronMethod = true;
                            createTimer.call(_this2, _extends({}, cron, { autoStart: true }));
                        }
                    });
                    if (!locatedCronMethod) {
                        throw new Error(`Cron method '${method}' does not exist and cannot be started.`);
                    }
                },
                time: function time(method, _time) {
                    var currentDate = +new Date();

                    if (!_this2._cron[method].timerRunning) {
                        _this2._cron[method].lastInvocation = currentDate;
                    }
                    var elapsed = currentDate - _this2._cron[method].lastInvocation;

                    _this2.$cron.stop(method);

                    if (elapsed > _time) {
                        _this2.$options.methods[method].call(_this2);
                        createTimer.call(_this2, { method, time: _time });
                    } else {
                        setTimeout(function () {
                            _this2.$options.methods[method].call(_this2);
                            createTimer.call(_this2, { method, time: _time });
                        }, _time - elapsed);
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
exports.cleanTime = _cleanTime2.default;
