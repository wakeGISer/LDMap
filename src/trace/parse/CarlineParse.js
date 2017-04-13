/**
 * Created by Administrator on 2017/4/11/011.
 */

export default {
    parse: function (data) {
        let self = this;
        var route = {
            start: [data.result.origin.originPt.lng, data.result.origin.originPt.lat],
            end: [data.result.destination.destinationPt.lng, data.result.destination.destinationPt.lat],
            steps: [],
            tactics: self.tactics[data.result.routes[0].tactics],
            toll: data.result.routes[0].toll + " 元", //过路费
            passpoi: [],
            distance: data.result.routes[0].distance,
            duration: data.result.routes[0].duration
        };
        var steps = data.result.routes[0].steps;
        for (let [idx, item] of steps.entries()) {
            if (item.path == "") continue;
            item.ispasspoi == 1 && route.passpoi.push([item.stepDestinationLocation.lng, item.stepDestinationLocation.lat])
            route.steps[idx] = {
                distance: item.distance,
                instruction: item.instruction,
                path: item.path.split(';').map((item) => {
                    return item.split(',');
                }), // Array.<ol.coordinate>
                turn: self.turn[item.turn]
            }
        }

        return route;
    },
    // 路径规划策略 默认值 11
    tactics: {
        11: "最少时间",
        1: '最省钱',
        13: '最少换乘',
        14: '最少步行',
        4: '最舒适模式',
        5: '不乘地铁'
    },

    turn: {
        0: {message: '进入'},
        1: {message: "直行", backgroundPosition: '-317px -75px'},
        2: {message: '右前方转弯', backgroundPosition: '-302px -340px'},
        3: {message: '右转', backgroundPosition: '-291px -102px'},
        4: {message: '右后方转弯', backgroundPosition: '-291px -376px'},
        5: {message: '掉头', backgroundPosition: '-268px -340px'},
        6: {message: '左后方转弯', backgroundPosition: '-291px -400px'},
        7: {message: '左转', backgroundPosition: '-293px -73px'},
        8: {message: '左前方转弯', backgroundPosition: '-285px -340px'},
        9: {message: '左侧', backgroundPosition: ''},
        10: {message: '右侧', backgroundPosition: ''},
        11: {message: '分歧-左', backgroundPosition: ''},
        12: {message: '分歧中央', backgroundPosition: ''},
        13: {message: '分歧右', backgroundPosition: ''},
        14: {message: '环岛', backgroundPosition: ''},
        15: {message: '进渡口', backgroundPosition: ''},
        16: {message: '出渡口', backgroundPosition: ''}
    }
}