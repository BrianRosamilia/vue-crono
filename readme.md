# vue-crono

Easily schedule and manage cron jobs in Vue component

[Example here](https://brianrosamilia.github.io/vue-crono/)

[Component Source here](https://github.com/BrianRosamilia/vue-crono/blob/master/src/app.vue)

## Installation

`npm install vue-crono --save`

```
import crono from 'vue-crono';
Vue.use(crono);
```

*or* include from https://unpkg.com/vue-crono@1.0.1/dist/index.js

`<script src="https://unpkg.com/vue-crono@1.0.1/dist/index.js"></script>` which puts the plugin under `window.crono`

*or* npm install the package and browse to `node_modules/vue-cron/dist/index.js` and copy the file into your application

## Usage

You schedule Vue methods to run on interval using the `cron` property on your Vue component.  `cron` can also accept an array of objects to call multiple methods.

```
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

