<template>
    <div class="ishow-lib-driving">
        <div id="title" class="planTitle" index="0"></div>
        <panel-Walk :routes="routes"></panel-Walk>
    </div>
</template>

<script>
    import panelWalk from './panelWalk.vue';
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
            panelWalk: panelWalk
        }
    }
</script>