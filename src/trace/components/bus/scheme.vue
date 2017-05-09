<template>
    <li class="scheme" v-bind:isopen="isopen"  @click="toggle">
        <font>{{ index + 1 }}</font>
        <form class="bus_line">
            <p class="bus_line_left">
                <font class="address">{{ buslines | getBusline }}</font>
                <font class="detailed_information">{{ detailed }}</font>
            </p>
            <span class="open">
                <img src="http://webapi.ishowchina.com/jsmap/3.4.3/images/img_1.gif" class="open_x"
                    style="background: rgba(0, 0, 0, 0) url(http://webapi.ishowchina.com/jsmap/3.4.3/images/search_03.png);background-position: -266px -44px;"/>
            </span>
        </form>
    </li>
</template>

<script>
    import bus from '../../event/bus';
    export default{
        props: ["route", "index", "routes"],
        data() {
            return {
                buslines: [],
                busNames: [],
                detailed: "",
                isopen: false
            }
        },
        mounted() {
            var route = this.route;
            for (let l in route.steps) {
                var item = route.steps[l];
                if (null != item.vehicle.name) { // 获取公交线路名称
                    var name = item.vehicle.name
                        , type = item.vehicle.type
                        , station = name.substring(name.indexOf("("))
                        , name = name.slice(0, name.indexOf("("));
                    0 == type && (name += "路",
                        item.vehicle.name = name + station);
                    this.busNames.push(name);
                }
            }
            0 < this.busNames.length && (this.buslines = this.busNames.join(" - "));
            this.detailed = this.getUnit(route.distance);
        },
        filters: {
            getBusline: function (lines) {
                if(lines){
                    return lines;
                }else {
                    return "没有乘车";
                }
            }
        },
        methods: {
            getUnit(num) {
                return num = 1E3 < num ? (num / 1E3).toFixed(2) + "公里" : num + "米"
            },
            toggle() {
                if(this.isopen = !this.isopen){
                    bus.$emit('open', this.index);
                    bus.$emit('draw', this.routes[this.index]);
                }else{

                }
            }
        }
    }
</script>