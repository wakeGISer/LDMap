<template>
    <div id="panel_driving_title" class="planTitle">
        <h3 title="">
        <b>{{ getTitlle(names) }}</b>
        </h3>
        <p>{{ getMin(duration) }} | {{ getUnit(dist) }} | <span>{{ tac }}</span></p>
    </div>
</template>

<script>
    export default {
        props: ["distance", "duration", "names" , "tactics"],
        data() {
            return {
                dist: this.distance,
                tac: this.tactics
            };
        },
        methods: {
            getUnit(num) {
                return num = 1E3 < num ? (num / 1E3).toFixed(2) + "公里" : num + "米"
            },
            getMin(num) {
                return num = 3600 < num ? Math.floor(num / 3600) + "小时" + (num / 3600)/60 + "分钟" :  (num / 60) + "分钟";
            },
            getTitlle(names) {
                if(names.length > 4){
                    return names.slice(0,2).join('>') + '......' + names.slice(names.length - 2).join('>');
                }else {
                    return names.join('>');
                }
            }
        }
    }
</script>