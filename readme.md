# vue-crono

[![CircleCI](https://circleci.com/gh/BrianRosamilia/vue-crono.svg?style=shield)](https://circleci.com/gh/BrianRosamilia/vue-crono)

Easily schedule and manage cron jobs in Vue component

[jsfiddle example](https://jsfiddle.net/brianrosamilia/7fq4nrbe)

[Project Example here](https://brianrosamilia.github.io/vue-crono)

[Project Example Source here](https://github.com/BrianRosamilia/vue-crono/blob/master/src/app.vue)

## Installation

```
npm install vue-crono --save
```

```javascript
import crono from 'vue-crono';
Vue.use(crono);
```

**or** include from [https://unpkg.com/vue-crono@1.0.5/dist/index.js](https://unpkg.com/vue-crono@1.0.5/dist/index.js)

`<script src="https://unpkg.com/vue-crono@1.0.5/dist/index.js"></script>` which will put the plugin on `window.crono`

**or** npm install the package and browse to `node_modules/vue-cron/dist/index.js` and copy the file into your application

## Usage

Schedule Vue methods to run on interval using the `cron` property on your Vue component.  `cron` also accepts an array of objects to call multiple methods.

`cron` option structure is as follows

```javascript
{
    // Number in miliseconds
    time: Number`,

    // Vue component method name
    method: String
}
```

Example Component to keep a timer up to date.

Other use cases:

 * Polling to check a status
 * Refreshing data from a service periodically
 * Warning a user about a time sensitive action

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

## API

If you create jobs via the `cron` option, you can manage them on the component instance using

`this.$cron.stop(methodName)`

and

`this.$cron.start(methodName)`

*Note:* Jobs are restarted from the beginning after being stopped.  Timers are cleaned up when components are destroyed.

You can adjust the time of existing jobs, even while they're running, using

`this.$cron.time(methodName, time)` (time is in milliseconds).  This method is smart enough to be aware if the new job time has been passed (if decreasing the timer length) as well as if you're extending the timer time by adding the time already surpassed.  Adjusting the time on a stopped job will start it from scratch. See unit tests if curious about this behavior!