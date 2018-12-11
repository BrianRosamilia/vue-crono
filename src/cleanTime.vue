<template>
    <span class="vue-crono-time">
        {{renderedTime}}
    </span>
</template>
<script>
    export default{
        name: 'cleanTime',
        data(){
            return { renderedTime: undefined };
        },
        props: {
          time: Date,
          round: { type: Number, default: 5 },
          dateFn: { type: String, default: 'toLocaleDateString' },
          dateFnParams: { type: String }
        },
        methods: {
            refreshTime(){
                const hoursAgo = (new Date() - this.time) / 1000 / 60 / 60;
                let time;
                const minutes = hoursAgo * 60;
                const roundedMinutes = Math.ceil(minutes / this.round) * this.round;

                if (roundedMinutes <= 55){
                    time = `${roundedMinutes} minutes ago`;
                }
                else if (hoursAgo < 8){
                    const floorHours = Math.floor(hoursAgo);
                    if (floorHours === 1){
                        time = '1 hour ago';
                    }
                    else{
                        time = `${floorHours} hours ago`;
                    }
                }
                else {
                    time = this.time[this.dateFn](this.dateFnParams);
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