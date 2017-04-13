<template>
    <div class="ishow-lib-driving">
        <div id="title" class="planTitle" index="0"></div>
        <panel-Car :routes="routes"></panel-Car>
    </div>
</template>

<script>
    import panelCar from './panelCar.vue';
    export default {
        props: ["dataMsg"],
        data() {
            return {
                routes: this.dataMsg
            };
        },
        mounted() {

        },
        components: {
            panelCar: panelCar
        }
    }
</script>