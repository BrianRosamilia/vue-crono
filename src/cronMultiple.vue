<template>
    <div></div>
</template>
<script>
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
            stopTimer(){
                this.$cron.stop('load');
                this.$cron.stop('stopTimer');
            }
        },
        mounted(){
            this.load();
        },
        cron:[{
            time: 5000,
            method: 'load',
        },
        {
            time: 32000,
            method: 'stopTimer'
        }]
    }
</script>