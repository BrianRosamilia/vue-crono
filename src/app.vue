<template>
    <div>
        <h2>vue-crono ⏰</h2>
        <div class="segment">
            <h3>The current time is {{ currentTime }}</h3>
            <p>updated every 5 seconds by <pre>cron: {  time: 5000, method: 'load'}</pre></p>
            <button v-if="cronRunning" v-on:click="stopTimer">Stop Timer</button>
            <button v-if="!cronRunning" v-on:click="startTimer">Start Timer</button>
            <!-- <button v-on:click="adjustTimer(10)">Change interval to 10 second updates</button>
            <button v-on:click="adjustTimer(5)">Change interval to 5 second updates</button>-->
        </div>
        <br/>
        <br/>
        <div class="segment">
            <h3>Clean Time Display</h3>
            <p>Show users how long ago something occurred in a concise manner by binding a Date object to <pre>&lt;clean-time&gt;&lt;/clean-time&gt;</pre> (times are set to update every minute)</p>
            <div class="time-table">
                🕒<clean-time v-bind:time="fiveMinutesAgo" v-bind:round="1"></clean-time> Minutes ago (capped at 55 minutes)
                <br/>
                🕒<clean-time v-bind:time="fiveHoursAgo"></clean-time> Hours ago (capped at 8 hours)
                <br/>
                🕒<clean-time v-bind:time="yesterday"></clean-time> Approximately one Day ago
                <br/>
                🕒<clean-time v-bind:time="tenDaysAgo"></clean-time> Days ago (displays actual date in user's locale format)
               <!-- <br/>
                🕒<clean-time v-bind:time="tenDaysAgo" v-bind:round="1" date-fn="toLocaleString" /> Days also support Date format functions
                <br/>-->
            </div>
            <p>You can also change the display strings</p>
            <div class="time-table">
                🕒<clean-time v-bind:time="minuteAgo" v-bind:round="1" v-bind:locale-map="{ en: {
                          minute: 'just now',
                          minutes: '${time} minutes ago',
                          hour: '${time} hour ago',
                          hours: '${time} hours ago',
                          day: '${time} day ago',
                          days: '${time} days ago'
                      } }"></clean-time> 1 minute ago or less
                <br/>
                🕒<clean-time v-bind:time="yesterday" v-bind:round="1" v-bind:locale-map="{ en: {
                          minute: 'just now',
                          minutes: '${time} minutes ago',
                          hour: '${time} hour ago',
                          hours: '${time} hours ago',
                          day: 'yesterday',
                          days: '${time} days ago'
                      } }"></clean-time> Approximately one Day ago
            </div>
        </div>
    </div>
</template>
<script>
    import cleanTime from './cleanTime.vue';

    export default{
        data(){
            const minuteAgo = new Date();

            const fiveMinutesAgo = new Date();
            fiveMinutesAgo.setMinutes(new Date().getMinutes() - 4);

            const fiveHoursAgo = new Date();
            fiveHoursAgo.setHours(new Date().getHours() - 5);

            const yesterday = new Date();
            yesterday.setHours(new Date().getHours() - 24);

            const tenDaysAgo = new Date();
            tenDaysAgo.setHours(new Date().getHours() - 24 * 10);

            return {
                currentTime: undefined,
                cronRunning: true,
                minuteAgo,
                fiveMinutesAgo,
                fiveHoursAgo,
                yesterday,
                tenDaysAgo
            };
        },
        components: {
            cleanTime
        },
        methods: {
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
          },
          adjustTimer(time){
              this.$cron.time('load', time * 1000);
          }
        },
        mounted(){
            this.load();
        },
        cron: {
            time: 5000,
            method: 'load'
        }
    };
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

    .segment {
        box-shadow: 0px 1px 2px 0 rgba(34, 36, 38, 0.15);
        margin: .1rem .1em;
        padding: .4rem;
        max-width:65%;
        margin-left:auto;
        margin-right:auto;
    }

    .time-table{
        text-align:left;
        margin-left:auto;
        margin-right:auto;
        display:inline-block;
    }

    .vue-crono-time{
        font-weight:bold;
    }
</style>