'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

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

    cron._cron = {};
    cron._cron.timer = setInterval(function () {
        if (cron._cron.disabled) return;
        _this.$options.methods[cron['method']].call(_this);
    }, cron.time);
};

var cron = function cron() {
    var saveMount = _vue2.default.prototype.$mount;

    _vue2.default.prototype.$mount = function () {
        for (var _len = arguments.length, allArgs = Array(_len), _key = 0; _key < _len; _key++) {
            allArgs[_key] = arguments[_key];
        }

        saveMount.call(this, ...allArgs);
        if (this.$options.cron !== undefined) {
            mapOrSingle(this.$options.cron, createTimer.bind(this));
        }
    };
};

Object.defineProperty(_vue2.default.prototype, '$cron', { get: function get() {
        return this;
    } });

_vue2.default.prototype.$cron.stop = function (method) {
    mapOrSingle(this.$options.cron, function (cron) {
        if (cron['method'] === method) {
            clearInterval(cron._cron.timer);
        }
    });
};

_vue2.default.prototype.$cron.start = function (method) {
    var _this2 = this;

    mapOrSingle(this.$options.cron, function (cron) {
        if (cron['method'] === method) {
            createTimer.call(_this2, cron);
        }
    });
};

exports.default = cron;
