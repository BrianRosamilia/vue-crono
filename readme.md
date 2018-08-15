# vue-crono

Easily schedule and manage cron jobs in Vue component

[jsfiddle example](https://jsfiddle.net/brianrosamilia/7fq4nrbe)

[Project Example here](https://brianrosamilia.github.io/vue-crono)

[Project Example Source here](https://github.com/BrianRosamilia/vue-crono/blob/master/src/app.vue)

Codepen Example:

## Installation

```
npm install vue-crono --save
```

```javascript
import crono from 'vue-crono';
Vue.use(crono);
```

**or** include from [https://unpkg.com/vue-crono@1.0.4/dist/index.js](https://unpkg.com/vue-crono@1.0.4/dist/index.js)

`<script src="https://unpkg.com/vue-crono@1.0.4/dist/index.js"></script>` which will put the plugin on `window.crono`

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