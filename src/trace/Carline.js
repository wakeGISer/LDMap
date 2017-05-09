/**
 * Created by wake on 2017/4/7/007.
 */

import bus from './event/bus';
import Vue from 'vue';
import appCar from './components/car/Car.vue';
import Config from './config/restConfig';
import BaseRoute from './BaseRoute';
import Parse from './parse/CarlineParse';



Car.prototype = Object.create(BaseRoute.prototype);

/**
 * @param {Object} options 组件参数
 * @param {ol.Map} options.map 地图实例对象
 * @param {String} options.panel 组件div的id
 * @constructor
 */
function Car(options) {
    BaseRoute.call(this,options);
    this._transferUrl = Config.routeCarUrl + Config.ak;
    this.carLayer  = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#0066FF',
                width: 5
            })
        })
    });
    this._map.addLayer(this.carLayer);
    this._setSelect();
};

Car.prototype._initPanel = function () {
    var self = this;
    var el = this._panel;
    let route = Parse.parse(this._responseData);
    "string" == typeof this._panel && (this._panel = document.getElementById(this._panel));
    this._panel.innerHTML = "<app-Car v-bind:data-msg='dataMsg' ></app-Car>";
    this._app = new Vue({
        el: '#' + el,
        data: {
            dataMsg: route
        },
        components: {
            appCar: appCar
        }
    });
    bus.$on('moveTo', this._moveTo.bind(self));
    this._draw(route);
}

Car.prototype._setSelect = function () {
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
            return layer == self.carLayer;
        }
    });
    this._addInteraction([selectWalk]);
};

Car.prototype._draw = function (route) {
    if(route){
        this.clearLayer();
        this._redraw(route);
    }
}

Car.prototype._redraw = function (route) {
    var aStyles = this._getPasspoiStyle(route);
    this._drawIcon(aStyles);
    let carFeatures = [];
    for(let step of route.steps){
        let geometry = new ol.geom.LineString(step.path);
        let carFeature = new ol.Feature({
            geometry: geometry
        });
        step.geometry = geometry;
        carFeature.setProperties({step: step});
        carFeatures.push(carFeature)
    }
    this.carLayer.getSource().addFeatures(carFeatures);
};


/**
 * 绘制起始终止 途中点icon
 * @param route
 * @returns {Array}
 * @private
 */
Car.prototype._getPasspoiStyle = function (route) {
    var passStyles = [];
    route.passpoi.forEach(function (item, idx) {
        passStyles.push({
            point: item,
            image: new ol.style.Icon({
                src: 'http://webapi.ishowchina.com/jsmap/3.4.3/images/point_1.png',
                anchor: [0.5, 1],
                size: [35, 30],
                offset: [436,0]
            })
        })
    });
    passStyles.push({
        point: route.start,
        image: new ol.style.Icon({
            src: 'http://webapi.ishowchina.com/jsmap/3.4.3/images/point_1.png',// //../../assets/img/start.png
            anchor: [0.5, 1],
            // imgSize: [24, 38], // 203 380
            size: [35, 30],
            offset: [367, 0]
        })
    });
    passStyles.push({
        point: route.end,
        image: new ol.style.Icon({
            src: 'http://webapi.ishowchina.com/jsmap/3.4.3/images/point_1.png',// //../../assets/img/start.png
            anchor: [0.5, 1],
            size: [35, 30],
            offset: [401, 0]
        })
    });
    return passStyles;
}

/**
 * 清除所有图层
 */
Car.prototype.clearLayer = function () {
    this.carLayer.getSource().clear();
    this.iconLayer.getSource().clear();
};

Car.prototype._moveTo = function (step) {
    var geometry = step.geometry;
    this._fly2Geometry(geometry);
};


export default Car;

