jest.mock('Vue', () => { return require('vue') }, { virtual: true });

import Vue from 'Vue';
import crono from '../index.js';
Vue.use(crono);
import app from '../src/app.vue';
import cronMultiple from '../src/cronMultiple.vue';
import autoStart from '../src/autoStart.vue';

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

describe('Cron', () => {
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

    test('Stop a job multiple times does not introduce an exception', () => {
        const mounted = new Cmp();
        mounted.$mount();
        mounted.stopTimer();
        mounted.stopTimer();

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

    test('Autostart test suite', () => {
        const Auto = Vue.extend(autoStart);
        const spyAutoStart = jest.spyOn(Auto.options.methods, 'load');
        const autoCmp = new Auto();
        autoCmp.$mount();
        autoCmp.stopTimer();
        autoCmp.stopTimer();

        expect(spyAutoStart.mock.calls.length).toBe(0);

        autoCmp.startTimer();

        adjustGlobalDate(10000);

        expect(spyAutoStart.mock.calls.length).toBe(2);
    });
});

describe('Clean-time', () => {
    test('Check time at several breakpoints', () => {
        const mounted = new Cmp();
        mounted.$mount();
        const childCmp = mounted.$refs.smallestTime;

        expect(childCmp.renderedTime).toBe('just now');

        //Should Still be 'just now' after some seconds pass
        childCmp.time.setMinutes(childCmp.time.getMinutes() - .5);
        childCmp.refreshTime();

        expect(childCmp.renderedTime).toBe('just now');

        childCmp.time.setMinutes(childCmp.time.getMinutes() - 4);
        childCmp.refreshTime();

        expect(childCmp.renderedTime).toBe('5 minutes ago');

        childCmp.time.setMinutes(childCmp.time.getMinutes() - 120);
        childCmp.refreshTime();

        expect(childCmp.renderedTime).toBe('2 hours ago');

        childCmp.time.setMinutes(childCmp.time.getMinutes() - 1440);
        childCmp.refreshTime();

        expect(childCmp.renderedTime).toBe('1 day ago');

        childCmp.time.setMinutes(childCmp.time.getMinutes() - 5760);
        childCmp.refreshTime();
        const expectedDate = childCmp.time.toLocaleDateString();

        expect(childCmp.renderedTime).toBe(expectedDate);
    });

    test('Check time when crossing over an hour', () => {
        const mounted = new Cmp();
        mounted.$mount();
        const childCmp = mounted.$refs.smallestTime;

        childCmp.time.setMinutes(childCmp.time.getMinutes() - 57);
        childCmp.refreshTime();

        for(let x = 0; x < 400; x++){
            childCmp.time.setSeconds(childCmp.time.getSeconds() - 1);
            childCmp.refreshTime();
            expect(childCmp.renderedTime).not.toBe('0 hours ago');
        }
    });
});