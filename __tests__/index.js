jest.useFakeTimers();
jest.mock('Vue', () => { return require('vue') }, { virtual: true });

import Vue from 'Vue';
import crono from '../src/index.js';
Vue.use(crono);
import app from '../src/app.vue';

describe('vue-crono test suite', () => {
    test('Schedule one job method, one Scheduled task will be called.', () => {
        const Cmp = Vue.extend(app);
        const spyLoad = jest.spyOn(Cmp.options.methods, 'load');

        const mounted = new Cmp();
        mounted.$mount();

        //jest.advanceTimersByTime(5000);
        jest.runOnlyPendingTimers();

        expect(spyLoad.mock.calls.length).toBe(2);
    });
});