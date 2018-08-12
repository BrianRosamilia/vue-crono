<template>
    <div>
        <h2>vue-crono ⏰</h2>
        <h3>The current time is {{ currentTime }}</h3>
        <p>( updated every 5 seconds by cron )</p>
        <button v-if="cronRunning" v-on:click="stopTimer">Stop Timer</button>
        <button v-if="!cronRunning" v-on:click="startTimer">Start Timer</button>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                currentTime: undefined,
                cronRunning: true
            }
        },
        methods:{
          load(){
              this.currentTime = (new Date().toLocaleTimeString());
          },
          stopTimer(){
              this.$cron.stop('load');
              this.cronRunning = false;
          },
          startTimer(){
            this.$cron.start('load');
            this.cronRunning = true;
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
</script>
<style>
    body{
        font-family:Helvetica
    }

    h3{
        font-family:"Times New Roman";
    }

    div{
        text-align:center;
    }

    h3{
        font-size:5rem;
    }
</style>