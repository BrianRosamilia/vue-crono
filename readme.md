# vue-crono

Easily schedule and manage cron jobs in Vue component

[jsfiddle example](https://jsfiddle.net/brianrosamilia/7fq4nrbe/1/)

[Project Example here](https://brianrosamilia.github.io/vue-crono/)

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

**or** include from [https://unpkg.com/vue-crono@1.0.1/dist/index.js](https://unpkg.com/vue-crono@1.0.1/dist/index.js)

`<script src="https://unpkg.com/vue-crono@1.0.1/dist/index.js"></script>` which will put the plugin on `window.crono`

**or** npm install the package and browse to `node_modules/vue-cron/dist/index.js` and copy the file into your application

## Usage

You schedule Vue methods to run on interval using the `cron` property on your Vue component.  `cron` can also accept an array of objects to call multiple methods.

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
      },
      startTimer(){
        this.$cron.start('load');
      }
    },
    mounted(){
        this.load();
    },
    cron:{
        time: 5000,
        method: 'load'
    }
}
```

## API

If you create jobs via the `cron` option, you can manage them on the component instance using

`this.$cron.stop(methodName)`

and

`this.$cron.start(methodName)`

Note: Jobs are restarted from the beginning after being stopped