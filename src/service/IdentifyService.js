/**
 * Created by Administrator on 2017/5/8/008.
 */
import {DrawingManager} from '../geometry/DrawingManager';
import IdentifyParameters from './IdentifyParameters';
import IdentifyTask from './IdentifyTask';

export class IdentifyServiceAGS {
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
    }

    reset() {
        this.IndentifyOverlay.setMap(this.map);
    }

    /**
     * 开启地图上单机查询模式
     * @param callback
     */
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

    start(type, cb) {
        this.reset();
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

    clear() {
        this.draw  && this.draw.end();
        this.IndentifyOverlay && this.IndentifyOverlay.getSource().clear() && this.IndentifyOverlay.setMap(null);
    }
}