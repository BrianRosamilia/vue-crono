# vue-crono

[![CircleCI](https://circleci.com/gh/BrianRosamilia/vue-crono.svg?style=shield)](https://circleci.com/gh/BrianRosamilia/vue-crono)

Easily schedule and manage cron jobs in Vue components

[jsfiddle example](https://jsfiddle.net/brianrosamilia/7fq4nrbe)

[Project Example here](https://brianrosamilia.github.io/vue-crono)

[Project Example Source here](https://github.com/BrianRosamilia/vue-crono/blob/master/src/app.vue)

## Installation

```
npm install vue-crono --save
```

Install globally

```javascript
import crono from 'vue-crono';
Vue.use(crono);
```

or inside your component

```javascript
import { crono } from 'vue-crono';

//Your component
export default{
    mixins: [crono]
}
```

**or** include from [https://unpkg.com/vue-crono@2.0.8/dist/index.js](https://unpkg.com/vue-crono@2.0.8/dist/index.js)

`<script src="https://unpkg.com/vue-crono@2.0.8/dist/index.js"></script>` which will put the plugin on `window.crono`

**or** npm install the package and browse to `node_modules/vue-cron/dist/index.js` and copy the file into your application

## Usage

Schedule Vue methods to run on interval using the `cron` property on your Vue component.  `cron` also accepts an array of objects to call multiple methods.

`cron` option structure is as follows

```javascript
{
    // Number in milliseconds
    time: Number,

    // Vue component method name
    method: String,
    
    // Automatic Start (true by default)
    autoStart: true
}
```

Example Component to keep a timer up to date.

Other use cases:

 * Polling to check a status
 * Refreshing data from a service periodically
 * Warning a user about a time sensitive action

Example:
```javascript
export default{
    data(){
        return {
            currentTime: undefined,
        }
    },
    methods:{
      load(){
          this.currentTime = (new Date().toLocaleTimeString());
      }
    },
    cron:{
        time: 1000,
        method: 'load'
    }
}
```

Multiple cron definition:
```javascript
cron:[{
    time: 5000,
    method: 'load',
},
{
    time: 32000,
    method: 'stopTimer'
}]
```

## API

If you create jobs via the `cron` option, you can start, stop, and restart them on the component instance using

`this.$cron.stop(methodName)`

`this.$cron.start(methodName)`

`this.$cron.restart(methodName)`

*Note:* Jobs are restarted from the beginning after being stopped.  Timers are cleaned up when components are destroyed.

You can adjust the time of existing jobs, even while they're running, using

`this.$cron.time(methodName, time)`  

This method is intelligent enough to know if the timer should have been invoked when decreasing the time of a job as well as extending the time to the next job run if you're increasing the timer.  Adjusting the time on a stopped job will behave as though you started it from scratch. (See unit tests if curious about this behavior)


## clean-time Component

`<clean-time></clean-time>`

`import cleanTime from 'vue-crono/cleanTime'`

A Vue component that provides human readable, realtime updated, timestamp for past events.  Supports localization and custom template strings.

`clean-time` requires a single prop `time` (a `Date` object) and offers some customization props.

[Example here](https://brianrosamilia.github.io/vue-crono)

[Example Source here](https://github.com/BrianRosamilia/vue-crono/blob/master/src/app.vue#L14-L48)