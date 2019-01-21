<template>
    <span class="vue-crono-time">
        {{renderedTime}}
    </span>
</template>
<script>
    const template = require('es6-template-strings');

    export default{
        name: 'cleanTime',
        data(){
            return { renderedTime: undefined };
        },
        props: {
          time: Date,
          round: { type: Number, default: 5 },
          dayAgo: { type: Boolean, default: true },
          dateFn: { type: String, default: 'toLocaleDateString' },
          locale: { type: String, default: 'en' },
          localeMap: {
              type: Object, default(){
                  return {
                      en: {
                          minute: '${time} minute ago',
                          minutes: '${time} minutes ago',
                          hour: '${time} hour ago',
                          hours: '${time} hours ago',
                          day: '${time} day ago'
                      }
                  };
              }
          }
        },
        methods: {
            refreshTime(){
                const minutesAgo = (new Date() - this.time) / 1000 / 60;
                const hoursAgo = minutesAgo / 60;
                const roundedMinutes = Math.ceil(minutesAgo / this.round) * this.round;

                let time;

                if(roundedMinutes == 0 || roundedMinutes === 1){
                    time = template(this.localeMap[this.locale].minute, { time: 1 });
                }
                else if (roundedMinutes <= 55){
                    time = template(this.localeMap[this.locale].minutes, { time: roundedMinutes });
                }
                else if (hoursAgo < 8){
                    const floorHours = Math.floor(hoursAgo);
                    if (floorHours === 0 || floorHours === 1){
                        time = template(this.localeMap[this.locale].hour, { time: floorHours });
                    }
                    else{
                        time = template(this.localeMap[this.locale].hours, { time: floorHours });
                    }
                }
                else if(hoursAgo >= 24 && hoursAgo <= 36){
                    time = template(this.localeMap[this.locale].day, { time: 1 });
                }
                else {
                    time = this.time[this.dateFn]();
                }

                this.renderedTime = time;
            }
        },
        mounted(){
            this.refreshTime();
        },
        cron: {
            time: 60000,
            method: 'refreshTime'
        }
    };
</script>