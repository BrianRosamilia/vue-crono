jest.useFakeTimers();
jest.mock('Vue', () => { return require('vue') }, { virtual: true });

import Vue from 'Vue';
import crono from '../src/index.js';
Vue.use(crono);
import app from '../src/app.vue';
import cronMultiple from '../src/cronMultiple.vue';

const Cmp = Vue.extend(app);
const spyLoad = jest.spyOn(Cmp.options.methods, 'load');

afterEach(() => {
    spyLoad.mock.calls = [];
});

test('Schedule one job method, one Scheduled task will be called.', () => {
    const mounted = new Cmp();
    mounted.$mount();
    //jest.advanceTimersByTime(5000);
    jest.runOnlyPendingTimers();

    expect(spyLoad.mock.calls.length).toBe(2);

    clearCronTimers(mounted);
});

test('Stop job, jobs will not execute for timer', () => {
    const mounted = new Cmp();
    mounted.$mount();
    mounted.stopTimer();

    jest.runOnlyPendingTimers();

    expect(spyLoad.mock.calls.length).toBe(1);

    clearCronTimers(mounted);
});

test('Run 5 second job for 60 seconds, job will run 12 times plus 1 time for initial load', () => {
    const mounted = new Cmp();
    mounted.$mount();

    jest.advanceTimersByTime(60000);

    expect(spyLoad.mock.calls.length).toBe(13);

    clearCronTimers(mounted);
});

test('Stopping a running job and restarting it gives the correct number of executions', () => {
    const mounted = new Cmp();
    mounted.$mount();// 1 execution

    jest.runOnlyPendingTimers();// 1 execution
    mounted.stopTimer();
    mounted.startTimer('load');

    jest.advanceTimersByTime(10000);// 2 executions

    expect(spyLoad.mock.calls.length).toBe(4);

    clearCronTimers(mounted);
});

test('Stopping or starting a cron job with a name that doesn\'t exist throws an error', () => {
    const mounted = new Cmp();
    mounted.$mount();

    expect(() => {
        mounted.$cron.start('loading123');
    }).toThrow();

    expect(() => {
        mounted.$cron.stop('loading123');
    }).toThrow();

    clearCronTimers(mounted);
});

test('Array of multiple timers on a component will function properly', () => {
    const Cmp = Vue.extend(cronMultiple);
    const spyLoad = jest.spyOn(Cmp.options.methods, 'load');

    const mounted = new Cmp();
    mounted.$mount();

    // Component specifically made to have two timers, one runs load() 6 times and the other stops after 32 seconds
    jest.advanceTimersByTime(10000000);

    expect(spyLoad.mock.calls.length).toBe(7);

    clearCronTimers(mounted);
});

function clearCronTimers(mounted){
    for(const prop in mounted._cron){
        if(mounted._cron[prop] !== undefined){
            clearInterval(mounted._cron[prop].timer);// have to clear timer(s) after each test or spy gets polluted
        }
    }
}