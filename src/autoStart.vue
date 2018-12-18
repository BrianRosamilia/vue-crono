<template>
    <p>autoStart</p>
</template>
<script>
    export default{
        data(){
            return {};
        },
        methods: {
            load(){
                console.log('pulse');
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
        },
        cron: {
            time: 5000,
            method: 'load',
            autoStart: false
        }
    };
</script>