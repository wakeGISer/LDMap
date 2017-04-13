<template>
    <dl id="resultDiv" class="plan plan-nobus" style="display: block;">
        <div class="ishow-lib-driving">
            <car-Header :distance="distance" :duration="duration"  :names="stationsName" :tactics="tactics"></car-Header>
            <dl id="panel_driving_resultDiv" class="plan plan-nobus" style="display: block;">
                <dt class="start">
                <div class="beforedt">起</div>
                <div class="afterdt"></div>
                <b>起点</b></dt>
                <template v-for="(step, idx) in steps">
                    <template v-if="idx == 0">
                        <dt id="driving-showHighlight" name="driving-showHighlight" @click="moveTo(step)">
                        <div class="beforedt"></div>
                        <div class="afterdt"></div>
                        <img src="http://webapi.ishowchina.com/jsmap/3.4.3/images/img_1.gif">
                        <b></b>进入<b>{{ step.instruction }}</b>，沿着<b>{{ step.instruction
                        }}</b>行驶{{ getUnit(step.distance) }}</dt>
                    </template>
                    <template v-if="idx != 0">
                        <dt id="driving-showHighlight" name="driving-showHighlight" @click="moveTo(step)" >
                        <div class="beforedt"></div>
                        <div class="afterdt"></div>
                        <img src="http://webapi.ishowchina.com/jsmap/3.4.3/images/img_1.gif"
                             v-bind:style="{backgroundPosition: steps[idx-1].turn.backgroundPosition}"       v-bind:class="[steps[idx-1].turn.message == '进入' ?  '' : 'bgImg']">
                        <b></b>{{ steps[idx-1].turn.message }}<b></b>，沿着<b>{{ step.instruction
                        }}</b>行驶{{ getUnit(step.distance) }}</dt>
                    </template>
                </template>
                <dt class="end">
                <div class="beforedt">终</div>
                <b>终点</b></dt></dl>
        </div>
    </dl>
</template>

<script>
    import Header  from './panelCarTitlle.vue';
    import bus from '../../event/bus';
    export default {
        props: ['routes'],
        data() {
            return {
                steps: this.routes.steps,
                distance: this.routes.distance,
                duration: this.routes.duration,
                stationsName: [],
                bgImg: "bgImg",
                tactics: this.routes.tactics
            };
        },
        components: {
            carHeader: Header
        },
        mounted() {
            var self = this;
            if(this.steps.length > 1){
                this.steps.forEach((item, idx) => {
                    self.stationsName.push(item.instruction);
                })
            }
//            console.log(this.routes)
            this.steps.forEach((step, idx) => {
                var children = document.querySelectorAll('#driving-showHighlight');
                step.dom = children[idx];
            });
        },
        methods: {
            getUnit(num) {
                return num = 1E3 < num ? (num / 1E3).toFixed(2) + "公里" : num + "米"
            },
            moveTo(step) {
                //console.log(step);
                bus.$emit('moveTo', step);
            }
        }
    }
</script>

<style>
    .bgImg {
        background: url(http://webapi.ishowchina.com/jsmap/3.4.3/images/search_03.png) no-repeat;
        width: 21px;
        height: 24px;
        position: absolute;
        left: -30px;
        top: 0px;
        z-index: 19;
        /*background-position: -296px -70px;*/
    }
</style>