/**
 * Created by wake on 2017/5/10/010.
 */

import FindParameters from './FindParameters';
import FindTask from './FindTask';


export class FindServiceAGS {
    /**
     * 查询ArcGIS Rest API exposed 地图服务，the search 可以被指定在单个图层上的单个字段，或者多个图层中的多个字段
     * @constructor
     * @param map {ol.Map} 地图实例对象
     * @param opts {Object} 参数
     */
    constructor(map, opts) {
        this.opts = {
            returnGeometry: !0,
            outSpatialReference: 4326
        };
        Object.assign(this.opts, opts);
        // this.cb = cb;
        this.map = map;
        this.initialize();
    }

    initialize() {
        var params = new FindParameters();
        Object.assign(params, this.opts);
        this._params = params;
        this.task = new FindTask(this.opts.url);
        this._temporaryLayer = new ol.layer.Vector({
            source: new ol.source.Vector(),
            style: new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 5,
                    fill: new ol.style.Fill({
                        color: "#0099ff"
                    })
                })
            })
        });
        this.map.addLayer(this._temporaryLayer);
    }

    /**
     * 发送一个请求到ArcGIS Rest map 服务资源，来查询指定条件下的要素
     * @param  {Function} cb 回调函数
     */
    search(cb) {
        this.clear();
        cb = cb || this._parseToMap;
        this.task.execute(this._params, cb.bind(this))
    }

    /**
     * 设置指定查询条件参数
     * @param  {String} key 查询条件名称
     * @param  {String} val 查询条件值
     */
    set(key, val) {
        this._params[key] = val;
    }

    /**
     * 清除结果
     */
    clear() {
        this._temporaryLayer.getSource().clear();
    }

    _parseToMap(data) {
        var self = this;
        data.results.forEach(function (item) {
            var feature = new ol.Feature({
                geometry: new ol.geom.Point([item.geometry.x, item.geometry.y])
            });
            self._temporaryLayer.getSource().addFeature(feature);
        })
    }
}