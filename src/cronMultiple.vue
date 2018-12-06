<template>
    <div></div>
</template>
<script>
    export default{
        data(){
            return {
                currentTime: undefined,
            };
        },
        methods: {
            load(){
                this.currentTime = (new Date().toLocaleTimeString());
            },
            stopTimer(){
                this.$cron.stop('load');
                this.$cron.stop('stopTimer');
            },
            adjustTimer(time){
                this.$cron.time('load', time * 1000);
            }
        },
        mounted(){
            this.load();
        },
        cron: [{
            time: 5000,
            method: 'load',
        },
        {
            time: 32000,
            method: 'stopTimer'
        }]
    };
</script>