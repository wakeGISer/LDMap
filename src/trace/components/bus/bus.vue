<template>
    <div class="bus_panel contro_panel contro_panel_position_lr contro_panel_height"
         style="width: 316px;background-color: #fff;">
        <div class="chose_four ">
            <ul class="chose_four_li">
                <template v-if="status == 0">
                    <template v-for="(route, index) in result.routes">
                        <bus-Scheme :route="route" :routes="routes" :index="index"></bus-Scheme>
                        <lin-Left :route="route" :index="index"></lin-Left>
                    </template>
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
                routes: [],
                status: this.dataMsg.status,
                result: this.dataMsg.result
            }
        },
        components: {
            busScheme: scheme,
            linLeft: linLeft
        },
        mounted() {
            console.log(this.dataMsg);
            for (let i = 0; i < this.result.routes.length; i++) {
                var scheme = this.result.routes[i].scheme[0];
                this.routes[i] = {
                    start: scheme.originLocation,
                    end: scheme.destinationLocation,
                    steps: []
                };
                for (let j = 0; j < scheme.steps.length; j++) {
                    var step = scheme.steps[j];
                    this.routes[i].steps[j] = {
                        path: step.path,
                        start: step.stepOriginLocation,
                        end: step.stepDestinationLocation,
                        type: step.type,
                        schemaStep: step
                    };
                }
            }

//            this.$emit('init-event',this.routes);
        }
    }
</script>