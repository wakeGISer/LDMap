/**
 * Created by Administrator on 2017/5/8/008.
 */

export class IdentifyService {
    constructor(map, opts) {
        this.opts = {
            url: opts['url'] || {}
        }
        this.map = map;

    },

    /**
     * 开启地图上单机查询模式
     * @param callback
     */
    startPointIdentify(callback) {

    },

    startPolygonIdentify(callback) {

    },

    startCircleIdentify(callback) {

    },
}