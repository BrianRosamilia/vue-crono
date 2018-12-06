jest.mock('Vue', () => { return require('vue') }, { virtual: true });

import Vue from 'Vue';
import crono from '../src/index.js';
Vue.use(crono);
import app from '../src/app.vue';
import cronMultiple from '../src/cronMultiple.vue';

const Cmp = Vue.extend(app);
const spyLoad = jest.spyOn(Cmp.options.methods, 'load');
let dateStarter = 1500000000000;
const BuiltInDate = Date;

beforeEach(() => {
    dateStarter = 1500000000000;
    /*eslint no-global-assign:off*/
    Date = class extends Date{
        constructor(){
            super();
            return new BuiltInDate(dateStarter);
        }
    };
    jest.useFakeTimers();
});

afterEach(() => {
    spyLoad.mock.calls = [];
});

function adjustGlobalDate(addTime){
    jest.advanceTimersByTime(addTime);
    dateStarter += addTime;
}

test('Schedule one job method, one Scheduled task will be called.', () => {
    const mounted = new Cmp();
    mounted.$mount();

    jest.runOnlyPendingTimers();

    expect(spyLoad.mock.calls.length).toBe(2);

    mounted.$destroy();
});

test('Stop job, jobs will not execute for timer', () => {
    const mounted = new Cmp();
    mounted.$mount();
    mounted.stopTimer();

    jest.runOnlyPendingTimers();

    expect(spyLoad.mock.calls.length).toBe(1);

    mounted.$destroy();
});

test('Run 5 second job for 60 seconds, job will run 12 times plus 1 time for initial load', () => {
    const mounted = new Cmp();
    mounted.$mount();

    jest.advanceTimersByTime(60000);

    expect(spyLoad.mock.calls.length).toBe(13);

    mounted.$destroy();
});

test('Start a job multiple times, only one job runs', () => {
    const mounted = new Cmp();
    mounted.$mount();
    mounted.startTimer();
    mounted.startTimer();
    mounted.startTimer();

    jest.advanceTimersByTime(6000);

    expect(spyLoad.mock.calls.length).toBe(2);

    mounted.$destroy();
});

test('Stopping a running job and restarting it gives the correct number of executions', () => {
    const mounted = new Cmp();
    mounted.$mount();// 1 execution

    jest.runOnlyPendingTimers();// 1 execution
    mounted.stopTimer();
    mounted.startTimer('load');

    jest.advanceTimersByTime(10000);// 2 executions

    expect(spyLoad.mock.calls.length).toBe(4);

    mounted.$destroy();
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

    mounted.$destroy();
});

test('Array of multiple timers on a component will function properly', () => {
    const Cmp = Vue.extend(cronMultiple);
    const spyLoad = jest.spyOn(Cmp.options.methods, 'load');

    const mounted = new Cmp();
    mounted.$mount();

    // Component specifically made to have two timers, one runs load() 6 times and the other stops after 32 seconds
    jest.advanceTimersByTime(10000000);

    expect(spyLoad.mock.calls.length).toBe(7);

    mounted.$destroy();
});

test('New time is greater than the old time and has not been passed', () => {
    const mounted = new Cmp();
    mounted.$mount();// 1 execution

    adjustGlobalDate(3000);

    mounted.adjustTimer(9);

    adjustGlobalDate(5000);

    expect(spyLoad.mock.calls.length).toBe(1);

    adjustGlobalDate(2000);

    expect(spyLoad.mock.calls.length).toBe(2);
    // 5 second interval
    // 3 seconds go by
    // set timer for 9 seconds
    mounted.$destroy();
});

test('New time is less than the old time and has been passed', () => {
    const mounted = new Cmp();
    mounted.$mount();// 1 execution

    adjustGlobalDate(3000);

    mounted.adjustTimer(2);

    expect(spyLoad.mock.calls.length).toBe(2);
    // 5 second interval
    // 3 seconds go by
    // set timer for 2 seconds
    mounted.$destroy();
});

test('New time is less than the old time and has not been passed', () => {
    const mounted = new Cmp();
    mounted.$mount();// 1 execution

    adjustGlobalDate(3000);

    mounted.adjustTimer(4);

    expect(spyLoad.mock.calls.length).toBe(1);

    adjustGlobalDate(1001);

    expect(spyLoad.mock.calls.length).toBe(2);
    // 5 second interval
    // 3 seconds go by
    // set timer for 4 seconds
    mounted.$destroy();
});

test('Adjusting time on a stopped job is the same as starting a new job from scratch', () => {
    const mounted = new Cmp();
    mounted.$mount();// 1 execution

    adjustGlobalDate(3000);

    mounted.stopTimer();

    mounted.adjustTimer(2);

    adjustGlobalDate(7000);

    expect(spyLoad.mock.calls.length).toBe(4);

    mounted.$destroy();
});