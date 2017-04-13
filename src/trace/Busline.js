/**
 * Created by wake on 2017/4/7/007.
 */



import Vue from "vue";
import Bus from "./components/bus/bus.vue";
import bus from './event/bus';



/**
 * businfo search control
 * @param options  {map: required, panel: required}
 * @constructor
 */
function Busline(options) {
    options = options || {};
    this._transferUrl = Busline.BUS_TRANSFER_URL + ("ak=" + Busline.ak + "&v=" + Busline.version + "&");
    this._panel = options.panel;
    options.map instanceof ol.Map ? this._map = options.map : (console.log('the attr map of options is required'))//required
    this._gpsType = options.gpsType || 'gcj02';
    // this._isConvert = this._gpsType != LD.Constants.PS_GCJ02;
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
    this.iconLayer = new ol.layer.Vector({
        source: new ol.source.Vector()
    });
    this.overlay;
    this._map.addLayer(this.iconLayer);
    this._map.addLayer(this.busLayer);
    this._map.addLayer(this.walkLayer);
    this._addInteration();
    //this.setTactics(options.tactics);
    // this.setCoordType(options.coordType)
};


Busline.prototype.search = function (startPoint, endPoint) {
    var self = this,
        queryParams = Busline.ak + '&' + Busline.version + "&";
    queryParams += "origin=" + startPoint.join(',') + "&destination=" + endPoint.join(',');
    queryParams += "&coord_type=" + self._gpsType + "&out_coord_type=" + self._gpsType;
    var url = Busline.BUS_TRANSFER_URL + queryParams;
    self._requestData(url, function (status, message) {
        self._initPanel();
    })
};

Busline.prototype._initPanel = function () {
    var self = this;
    var data = this._responseData;
    var el = this._panel;
    "string" == typeof this._panel && (this._panel = document.getElementById(this._panel));
    this._panel.innerHTML = "<app-Bus v-bind:data-msg='dataMsg' ></app-Bus>"
    this._app = new Vue({
        el: '#' + el,
        data: {
            dataMsg: data
        },
        components: {
            appBus: Bus
        },
        methods: {
            // initEvt : function (routes) {
            //     self._initEvent(routes);
            // }
        }
    });

    bus.$on('draw', this._draw.bind(self));

    // console.log(this._app);
    /* var divHtml = '<div class="chose_four"><ul class="chose_four_li">',
     routes = [];*/
    // success 状态码
    /*if (0 == data.status) {
     for (var i = 0; i < data.result.routes.length; i++) {
     var scheme = data.result.routes[i].scheme[0];
     routes[i] = {
     start: scheme.originLocation,
     end: scheme.destinationLocation,
     steps: []
     };
     var busNames = [], buslines = "", l;
     for (l in scheme.steps) {
     var item = scheme.steps[l];
     if (null != item.vehicle.name) { // 获取公交线路名称
     var name = item.vehicle.name
     , type = item.vehicle.type
     , station = name.substring(name.indexOf("("))
     , name = name.slice(0, name.indexOf("("));
     0 == type && (name += "路",
     item.vehicle.name = name + station);
     busNames.push(name);
     }
     }
     0 < busNames.length && (buslines = busNames.join(" - "));
     var aLi = [];
     for (l = 0; l < scheme.steps.length; l++) {
     var step = scheme.steps[l];
     routes[i].steps[l] = {
     path: step.path,
     start: step.stepOriginLocation,
     end: step.stepDestinationLocation,
     type: step.type,
     schemaStep: step
     };
     var walkOrBushtml = this._getWalkOrBusHtml(step, l, scheme.steps);
     if (walkOrBushtml == undefined) {
     continue;
     }
     aLi.push(walkOrBushtml);
     }
     divHtml = this._getSchemaHtml(divHtml, aLi, i, buslines, scheme);
     }
     if (this._panel.nodeType === 1) {
     divHtml += "</ul></div>";
     this._panel.innerHTML = divHtml;
     this._initEvent(routes);
     }
     }*/
};


Busline.prototype._getWalkOrBusHtml = function (step, index, steps) {
    if (step.path != "") {
        var html = "";
        // walk or bus
        if (5 == step.type) {
            var li = '<li class="line_long03"><p class="round" style="background:url(' + Busline.STATIC_URL + 'images/round_03.png)0 0 no-repeat;" ></p><p><span>步行至 <b class="path_end">' + (null == steps[index + 1] ? "目的地" : steps[index + 1].vehicle.start_name) + "</b></span><font>" + this._getUnit(step.distance) + "</font></p></li>";
            step.liHtml = li;
            html = '<ul class="line_long" data-step-index="' + index + '">' + li + "</ul>";
        } else {
            li = '<li class="line_long02"><p class="round" style="background:url(' + Busline.STATIC_URL + 'images/round_03.png)0 0 no-repeat;"></p><p>' + ('<span class="path_line">' + step.vehicle.name + '</span><br/><b class="path_start">' + step.vehicle.start_name + '</b> 上车<br/><b class="path_end">' + step.vehicle.end_name + "</b> 下车") + "<font>" + (parseInt(step.vehicle.stop_num) + 1) + "站</font></p></li>";
            step.liHtml = li;
            html = '<ul class="line_long_shi" data-step-index="' + index + '">' + li + "</ul>"
        }
        return html;
    }
}

Busline.prototype._getSchemaHtml = function (divHtml, aLi, i, buslines, scheme) {
    var schemaHtml = '<li class="scheme" isopen="false" data-index="' + i + '">' + ("<font>" + (i + 1) + "</font>") + '<form class="bus_line"><p class="bus_line_left"><font class="address">' + (buslines || "没有乘车") + '</font><font class="detailed_information">' + this._getUnit(scheme.distance) + '</font></p><span class="open"><img src="' + Busline._MAP_IS_DEFIMG_URL + '" class="shouqi" style="background: rgba(0, 0, 0, 0) url(' + Busline.STATIC_URL + 'images/search_03.png);background-position: -266px -44px;"></span></form></li>';
    if (this._panel) {
        var detailHtml = '<li class="lin_left_x" style="display: none;"><span class="begin">起</span><div class="qi_x"><p><b>起点</b></p></div>';
        for (let item in aLi) {
            detailHtml += aLi[item];
        }
        divHtml += schemaHtml + (detailHtml + '<span class="end">终</span><div class="end_x">终点</div></li>');
        return divHtml;
    }
}

Busline.prototype._getUnit = function (num) {
    return num = 1E3 < num ? (num / 1E3).toFixed(2) + "公里" : num + "米"
}

Busline.prototype._initEvent = function () {
    var aLiScheme = document.getElementsByClassName("scheme");
    if (aLiScheme[0]) {
        aLiScheme[0].dispatchEvent(new MouseEvent('click'));
    }
}

Busline.prototype._addInteration = function () {
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
    this._map.addInteraction(selectWalk);

    var selectBus = new ol.interaction.Select({
        condition: ol.events.condition.click,
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: "#0ae6fb",
                width: 5
            })
        }),
        filter: function (feature, layer) {
            return layer == self.busLayer;
        }
    });

    this._map.addInteraction(selectBus);
    self._addPopup([selectWalk,selectBus]);
};


/**
 *
 * @param selects
 * @type  Array.{ol.interation.Select}
 * @private
 */
Busline.prototype._addPopup = function (selects) {
    var self = this;
    var elemPopup = document.createElement('div');
    elemPopup.id = "leador-popup";
    elemPopup.className = "leador-ol-popup";
    elemPopup.innerHTML = '<a href="#" id="leador-popup-closer" class="leador-ol-popup-closer"></a> <div id="leador-popup-content"></div>';
    document.body.appendChild(elemPopup);
    var container = document.getElementById('leador-popup');
    var content = document.getElementById('leador-popup-content');
    var closer = document.getElementById('leador-popup-closer');
    this.overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    }));
    /**
     * Add a click handler to hide the popup.
     * @return {boolean} Don't follow the href.
     */
    closer.onclick = function () {
        self.overlay.setPosition(undefined);
        closer.blur();
        return false;
    };
    this._map.addOverlay(this.overlay);
    selects.forEach(function (select) {
        select.on('select', function (e) {
            if (e.selected[0]) {
                // console.log(e);
                var step = e.selected[0].getProperties()["step"];
                var coordinate = e.mapBrowserEvent.coordinate;
                content.innerHTML = '<ul class="line_long">' + step.schemaStep.dom.innerHTML + "</ul>";
                self.overlay.setPosition(coordinate);
            } else {
                // close the overlay
                closer.dispatchEvent(new MouseEvent('click'));
            }
        });
    })
};

/**
 *
 * @param url
 * @param callback
 * @private
 */
Busline.prototype._requestData = function (url, callback) {
    this._responseData = {};
    var self = this;
    // var client = new XMLHttpRequest(),
    //     self = this;
    // client.addEventListener('load', function () {
    //     var json = JSON.parse(this.responseText);
    //     self._responseData = json;
    //     callback.call(self, json.status, 0 == json.status ? json : json.message);
    // });
    // client.addEventListener('error', function () {
    //     throw(new Error('Failed to fetch ' + url));
    // });
    // client.open('GET', url);
    // client.send();
    this.HTTPJsonP(url, function (json) {
        self._responseData = json;
        callback.call(self, json.status, 0 == json.status ? json : json.message);
    });
}


Busline.prototype.HTTPJsonP = function (url, callback) {
    var script = document.createElement('script');
    var guid = "_" + Math.round(Math.random() * Math.pow(10, 6)) + "_";
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.src = url + "&callback=window." + guid;
    window[guid] = function (data) {
        window[guid] = null;
        delete  window[guid];
        callback(data)
        document.getElementsByTagName("head")[0].removeChild(script)
    }
    document.getElementsByTagName('head')[0].appendChild(script);
}


Busline.prototype._showSchemeLi = function (schemeLi, lin_leftLi, isopen) {
    var flagImg = (schemeLi.getElementsByClassName("shouqi")[0] || schemeLi.getElementsByClassName("open_x")[0])
    "true" == isopen ? (schemeLi.setAttribute("isopen", "false"),
        lin_leftLi.style.display = "none",
        flagImg.className = "shouqi") : (schemeLi.setAttribute("isopen", "true"),
        lin_leftLi.style.display = "block",
        flagImg.className = "open_x")
}

Busline.prototype._draw = function (route) {
    this.clearLayers();
    var steps = route.steps;
    var start = route.start.split(',');
    var end = route.end.split(',');
    // 绘制起始位置和终止位置图标
    this._drawIcon([
        {
            point: start,
            image: new ol.style.Icon({
                src: 'http://webapi.ishowchina.com/jsmap/3.4.3/images/search_03.png',// //../../assets/img/start.png
                anchor: [0.5, 1],
                // imgSize: [24, 38], // 203 380
                size: [24, 38],
                offset: [204, 375]
            })
        }, //
        {
            point: end,
            image: new ol.style.Icon({
                src: 'http://webapi.ishowchina.com/jsmap/3.4.3/images/search_03.png',// //../../assets/img/start.png
                anchor: [0.5, 1],
                // imgSize: [24, 38], // 268 380
                size: [24, 38],
                offset: [269,375]
            })
        } //http://webapi.ishowchina.com/jsmap/3.4.3/images/search_03.png
    ]);
    let walkFeatures =  [];
    let lineFeatures = [];
    for (var step in steps) {
        if (steps[step].type == 5) {
            if(steps[step].path == "") continue;
            steps[step].geometry = this._parseToGeometry(steps[step].path);
            let walkFeature = new ol.Feature({
                geometry: steps[step].geometry
            });
            walkFeature.setProperties({step: steps[step]});
            walkFeatures.push(walkFeature)
            //this.walkLayer.getSource().addFeature(walkFeature);
        } else {
            steps[step].geometry = this._parseToGeometry(steps[step].path);
            var lineFeature = new ol.Feature(steps[step].geometry);
            lineFeature.setProperties({step: steps[step]});
            lineFeatures.push(lineFeature);
            //this.busLayer.getSource().addFeature(lineFeature)；
        }
    }
    this.walkLayer.getSource().addFeatures(walkFeatures);
    this.busLayer.getSource().addFeatures(lineFeatures);

    //this._addInteration();
};

Busline.prototype.clearLayers = function () {
    this.walkLayer.getSource().clear();
    this.busLayer.getSource().clear();
    this.iconLayer.getSource().clear();
}


/**
 *
 * @param pointCollection  [{url: icon address, point: [0,0]}]
 * @private
 */
Busline.prototype._drawIcon = function (pointCollection) {
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
}

Busline.prototype._parseToGeometry = function (path) {
    var path = path.split(";");
    var lineString = [];
    for (let i = 0; i < path.length; i++) {
        var point = path[i].split(",");
        point[0] = parseFloat(point[0]);
        point[1] = parseFloat(point[1]);
        lineString.push(point);
    }
    return new ol.geom.LineString(lineString);
}
// ishow rest
Busline.BUS_TRANSFER_URL = "http://api.ishowchina.com/v3/route/bus?";

// ishow key
Busline.ak = "ak=ec85d3648154874552835438ac6a02b2";

// ishow version
Busline.version = "v=3.4.3";

Busline.STATIC_URL = "http://webapi.ishowchina.com/jsmap/3.4.3/";

Busline._MAP_IS_SEARCH_URL = "images/search_03.png";

Busline._MAP_IS_DEFIMG_URL = "images/img_1.gif";


module.exports = Busline;