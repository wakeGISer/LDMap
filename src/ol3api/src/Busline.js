/**
 * Created by wake on 2017/4/7/007.
 */


import Vue from "vue";
import Bus from "./components/bus/bus.vue";
import bus from './event/bus';
import BaseRoute from './BaseRoute';
import Config from './config/restConfig';
import Parse from './parse/BuslineParse';


Busline.prototype = Object.create(BaseRoute.prototype);

/**
 * 公交轨迹查询构造函数
 * @param {Object} options 组件参数
 * @param {ol.Map} options.map 地图实例对象
 * @param {String} options.panel 组件div的id
 * @constructor
 */
L.Busline = function(options) {
    BaseRoute.call(this, options);
    this._transferUrl = Config.routeBusUrl + Config.ak;
    this.busLayer = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#0066FF',
                width: 5
            })
        })
    });
    this.walkLayer = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#AFAFAF',
                // color: '#0066FF',
                lineDash: [8],
                width: 5
            })
        })
    });
    this._map.addLayer(this.busLayer);
    this._map.addLayer(this.walkLayer);
    this._setSelect();
};

L.Busline.prototype._initPanel = function () {
    var self = this;
    var el = this._panel;
    let route = Parse.parse(this._responseData);
    "string" == typeof this._panel && (this._panel = document.getElementById(this._panel));
    this._panel.innerHTML = "<app-Bus v-bind:data-msg='dataMsg' ></app-Bus>"
    this._app = new Vue({
        el: '#' + el,
        data: {
            dataMsg: route
        },
        components: {
            appBus: Bus
        }
    });

    bus.$on('draw', this._draw.bind(self));
};

L.Busline.prototype._setSelect = function () {
    var self = this;
    var selectWalk = new ol.interaction.Select({
        condition: ol.events.condition.click,
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: "#0ae6fb",
                lineDash: [8],
                width: 5
            })
        }),
        filter: function (feature, layer) {
            return layer == self.walkLayer;
        }
    });
    var selectBus = new ol.interaction.Select({
        condition: ol.events.condition.click,
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: "#0ae6fb",
                width: 5
            })
        }),
        filter: function (feature, layer) {
            return layer != self.iconLayer;
        }
    });
    this._addInteraction([selectBus]);
};

L.Busline.prototype._draw = function (route) {
    if (route) {
        this.clearLayers();
        this._redraw(route);
    }
};

L.Busline.prototype._redraw = function (route) {
    var steps = route.steps;
    // 绘制起始位置和终止位置图标
    var aStyles = this._getStyle(route);
    this._drawIcon(aStyles);
    let walkFeatures = [];
    let lineFeatures = [];
    for (let step of steps) {
        if (step.type == 5) {
            step.geometry = new ol.geom.LineString(step.path);
            let walkFeature = new ol.Feature(step.geometry);
            walkFeature.setProperties({step: step});
            walkFeatures.push(walkFeature);
        } else {
            step.geometry = new ol.geom.LineString(step.path);
            var lineFeature = new ol.Feature(step.geometry);
            lineFeature.setProperties({step: step});
            lineFeatures.push(lineFeature);
        }
    }
    this.walkLayer.getSource().addFeatures(walkFeatures);
    this.busLayer.getSource().addFeatures(lineFeatures);
};

L.Busline.prototype._getStyle = function (route) {
    var passStyles = [];
    passStyles.push({
        point: route.start,
        image: new ol.style.Icon({
            src: 'http://webapi.ishowchina.com/jsmap/3.4.3/images/search_03.png',// //../../assets/img/start.png
            anchor: [0.5, 1],
            // imgSize: [24, 38], // 203 380
            size: [24, 38],
            offset: [204, 375]
        })
    });
    passStyles.push({
        point: route.end,
        image: new ol.style.Icon({
            src: 'http://webapi.ishowchina.com/jsmap/3.4.3/images/search_03.png',// //../../assets/img/start.png
            anchor: [0.5, 1],
            // imgSize: [24, 38], // 268 380
            size: [24, 38],
            offset: [269, 375]
        })
    });
    return passStyles;
};

/**
 * 清除所有图层
 */
L.Busline.prototype.clearLayers = function () {
    this.walkLayer.getSource().clear();
    this.busLayer.getSource().clear();
    this.iconLayer.getSource().clear();
};



L.Busline.prototype._drawIcon = function (pointCollection) {
    var self = this;
    if (Array.isArray(pointCollection)) {
        pointCollection.forEach(function (item) {
            var anchor = new ol.Feature({
                geometry: new ol.geom.Point(item.point)
            });
            anchor.setStyle(new ol.style.Style({
                image: item.image
            }));
            self.iconLayer.getSource().addFeature(anchor);
        })
    } else {
        var anchor = new ol.Feature({
            geometry: new ol.geom.Point(pointCollection.point)
        });
        anchor.setStyle(new ol.style.Style({
            image: pointCollection.image
        }));
        self.iconLayer.getSource().addFeature(anchor);
    }
};

module.exports = L.Busline;