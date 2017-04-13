<template>
    <li class="lin_left_x" v-bind:style="{display: activeBlock}">
        <span class="begin">起</span>
        <div class="qi_x"><p><b>起点</b></p></div>
        <template v-for="(item, index) in scheme.steps">
            <template v-if="item.type == 5">
                <ul class="line_long" data-step-index="0">
                    <li class="line_long03"><p class="round"
                                               style="background:url(http://webapi.ishowchina.com/jsmap/3.4.3/images/round_03.png)0 0 no-repeat;"></p>
                        <p><span>步行至 <b
                                class="path_end">{{ (null == scheme.steps[index + 1] ? "目的地" : scheme.steps[index + 1].vehicle.start_name)
                            }}</b></span><font>{{ getUnit(item.distance) }}</font></p></li>
                </ul>
            </template>
            <template v-if="item.type != 5">
                <ul class="line_long_shi" data-step-index="1">
                    <li class="line_long02"><p class="round"
                                               style="background:url(http://webapi.ishowchina.com/jsmap/3.4.3/images/round_03.png)0 0 no-repeat;"></p>
                        <p><span class="path_line">{{item.vehicle.name}}</span><br><b
                                class="path_start">{{ item.vehicle.start_name }}</b> 上车<br><b
                                class="path_end">{{ item.vehicle.end_name }}</b>
                            下车<font>{{ (parseInt(item.vehicle.stop_num) + 1) + "站"}}</font></p></li>
                </ul>
            </template>
        </template>
        <span class="end">终</span>
        <div class="end_x">终点</div>
    </li>
</template>

<script>
    import bus from '../../event/bus';
    import _ from "lodash";
    export default {
        props: ["route", "index"],
        data() {
            return {
                scheme: this.route.scheme[0],
                detailed: "",
                activeBlock: "none"
            }
        },
        mounted() {
            let scheme = this.route.scheme[0];
            let self = this;
            //this.detailed = this.getUnit(scheme.distance);
            scheme.steps.forEach((step, idx) => {
                var children = self.$el.children
                let elems = _.filter(children, (elem, index) => {
                    return elem.tagName.toLowerCase() == 'ul';
                });
                step.dom = elems[idx];

            });
            bus.$on('open', this.show);
        },
        methods: {
            getUnit(num) {
                return num = 1E3 < num ? (num / 1E3).toFixed(2) + "公里" : num + "米"
            },
            show(idx) {
                if (idx == this.index) {
                    this.activeBlock = 'block';
                } else {
                    this.activeBlock = 'none';
                }
            }
        }
    }
</script>