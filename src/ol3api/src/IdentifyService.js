/**
 * Created by Administrator on 2017/5/8/008.
 */
import {DrawingManager} from '../geometry/DrawingManager';
import IdentifyParameters from './IdentifyParameters';
import IdentifyTask from './IdentifyTask';

export class IdentifyServiceAGS {
    /**
     * 在发布的地图服务资源图层上 对exposed 的ArcGIS REST API 执行Identify 操作
     * @constructor
     * @param map {ol.Map} 地图实例对象
     * @param opts {Object} 参数
     */
    constructor(map, opts) {
        this.opts = {
            returnGeometry: !0,
            tolerance: 0,
            spatialReference: 4326,
        };
        Object.assign(this.opts, opts);
        // this.cb = cb;
        this.map = map;
        this.features = new ol.Collection();
        this.source = new ol.source.Vector({
            features: this.features
        });
        this.IndentifyOverlay = new ol.layer.Vector({
            source: this.source,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 5,
                    fill: new ol.style.Fill({
                        color: '#ffcc33'
                    })
                })
            })
        });
        this.IndentifyOverlay.setMap(this.map);
        this.initialize();
    }

    initialize() {
        var params = new IdentifyParameters();
        Object.assign(params, this.opts);
        this._params = params
        this._params.mapExtent = this.map.getView().calculateExtent(this.map.getSize())
        this.task = new IdentifyTask(this.opts.url);
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
        })
        this.map.addLayer(this._temporaryLayer);
    }

    reset() {
        this.IndentifyOverlay.setMap(this.map);
        Object.assign(this._params, {
            tolerance: 0
        })
    }


    startPointIdentify(callback) {
        let draw = new DrawingManager(this.map, this.features);
        this.draw = draw;
        var self = this;
        draw.start("Point", function ({feature, target, type}) {
            self._params.geometry = feature.getGeometry();
            //self._params.mapExtent = feature.getGeometry().getExtent();
            self.task.execute(self._params, callback)
        });
    }

    startPolygonIdentify(callback) {
        let draw = new DrawingManager(this.map, this.features);
        this.draw = draw;
        var self = this;
        draw.start("Polygon", function ({feature, target, type}) {
            self._params.geometry = feature.getGeometry();
            self.task.execute(self._params, callback)
        });
    }

    startCircleIdentify(callback) {
        let draw = new DrawingManager(this.map, this.features);
        this.draw = draw;
        var self = this;
        draw.start("Circle", function ({feature, target, type}) {
            self._params.geometry = feature.getGeometry();
            self.task.execute(self._params, callback)
        });
    }

    /**
     * 执行 空间查询， 可支持 点、圆、 多边形查询
     * @param type {String} 空间查询的几何类型
     * @param cb {Function} 回调函数
     */
    start(type, cb) {
        this.reset();
        cb = (cb || this._parseToMap).bind(this);
        switch (type) {
            case "Point" :
                this.startPointIdentify(cb);
                break;
            case "Circle" :
                this.startCircleIdentify(cb);
                break;
            case "Polygon" :
                this.startPolygonIdentify(cb);
                break;
        }
    }

    /**
     * 清除查询结果
     */
    clear() {
        this.draw  && this.draw.end();
        this.IndentifyOverlay && this.IndentifyOverlay.getSource().clear() && this.IndentifyOverlay.setMap(null);
        this._temporaryLayer.getSource().clear();
    }


    /**
     * 设置指定查询条件参数
     * @param key {String} 查询条件名称
     * @param val {String} 查询条件值
     */
    set(key, val) {
        this._params[key] = val;
    }


    _parseToMap(data) {
        var self = this;
        data.results.forEach(function (item) {
            var feature = new ol.Feature({
                geometry: new ol.geom.Point([item.geometry.x, item.geometry.y])
            })
            self._temporaryLayer.getSource().addFeature(feature);
        })
    }
}