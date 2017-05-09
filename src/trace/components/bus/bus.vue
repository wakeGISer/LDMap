<template>
    <div class="bus_panel contro_panel contro_panel_position_lr contro_panel_height"
         style="width: 316px;background-color: #fff;">
        <div class="chose_four ">
            <ul class="chose_four_li">
                <template v-for="(route, index) in routes">
                    <bus-Scheme :route="route" :routes="routes" :index="index"></bus-Scheme>
                    <lin-Left :route="route" :index="index"></lin-Left>
                </template>
            </ul>
        </div>
    </div>
</template>

<script>

    import BusParse from '../../parse/BuslineParse';
    import scheme from './scheme.vue';
    import linLeft from './linLeft.vue';
    export default {
        props: ["dataMsg"],
        data() {
            return {
                //dataMsg: this.dataMsg
                routes: this.dataMsg
            }
        },
        components: {
            busScheme: scheme,
            linLeft: linLeft
        }
    }
</script>