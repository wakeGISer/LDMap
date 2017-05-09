/**
 * Created by wake on 2017/4/7/007.
 */

import bus from './event/bus';
import Vue from 'vue';
import appWalk from './components/walk/walk.vue';
import Config from './config/restConfig';
import BaseRoute from './BaseRoute';
import Parse from './parse/WalklineParse';

Walkline.prototype = Object.create(BaseRoute.prototype);


/**
 * 步行轨迹构造函数
 * @param {ol.Map} options.map 地图实例对象
 * @param {String} options.panel 组件div的id
 * @param {Object} options 步行组件参数
 * @constructor
 */
L.Walkline = function(options) {
    BaseRoute.call(this, options);
    this._transferUrl = Config.routeWalkUrl + Config.ak;
    this.walkLayer = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#0066FF',
                width: 5
            })
        })
    });
    this._map.addLayer(this.walkLayer);
    this._setSelect();
}


/**
 * 初始化面板
 * @private
 */
L.Walkline.prototype._initPanel = function () {
    var self = this;
    var el = this._panel;
    let route = Parse.parse(this._responseData);
    "string" == typeof this._panel && (this._panel = document.getElementById(this._panel));
    this._panel.innerHTML = "<app-Walk v-bind:data-msg='dataMsg' ></app-Walk>";
    this._app = new Vue({
        el: '#' + el,
        data: {
            dataMsg: route
        },
        components: {
            appWalk: appWalk
        }
    });
    bus.$on('moveTo', this._moveTo.bind(self));
    this._draw(route);
};


/**
 * 绘制路径
 * @param {Object} route  路径数据
 * @private
 */
L.Walkline.prototype._draw = function (route) {
    if(route){
        this.clearLayer();
        this._redraw(route);
    }
}

/**
 * 重绘
 * @param {Object} route  路径数据
 * @private
 */
L.Walkline.prototype._redraw = function (route) {
    var aStyles = this._getPasspoiStyle(route);
    this._drawIcon(aStyles);
    let walkFeatures = [];
    for(let step of route.steps){
        let geometry = new ol.geom.LineString(step.path);
        let walkFeature = new ol.Feature({
            geometry: geometry
        });
        step.geometry = geometry;
        walkFeature.setProperties({step: step});
        walkFeatures.push(walkFeature)
    }
    this.walkLayer.getSource().addFeatures(walkFeatures);
};


/**
 * 设置要素的交互
 * @private
 */
L.Walkline.prototype._setSelect = function () {
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
    this._addInteraction([selectWalk]);
};

/**
 * 清除所有图层
 */
L.Walkline.prototype.clearLayers = function () {
    this.walkLayer.getSource().clear();
    this.iconLayer.getSource().clear();
};

/**
 * 获取 图标样式
 * @param {Object} route 路径塑胶
 * @returns {Array} 返回起始点和终止点的图标样式
 * @private
 */
L.Walkline.prototype._getPasspoiStyle = function (route) {
    var passStyles = [];
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
};

/**
 * 移动到当前选择的路段
 * @param {Object} step 当前路段数据
 * @private
 */
L.Walkline.prototype._moveTo = function (step) {
    var geometry = step.geometry;
    this._fly2Geometry(geometry);
};


export default Walkline;