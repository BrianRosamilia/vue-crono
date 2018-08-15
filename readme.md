# vue-crono

Easily schedule and manage cron jobs in your Vue component

[Example here]()

## Installation

`npm install vue-crono --save`

```
import crono from 'vue-crono';
Vue.use(crono);
```

or include from unpkg.com

or browse to /dist/index.js

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

