/**
 * Created by Administrator on 2017/4/11/011.
 */


/**
 * Abstract Class
 * @param options
 * @constructor
 */
function BaseRoute(options) {
    options = options || {};
    this._panel = options.panel;
    options.map instanceof ol.Map ? this._map = options.map : (console.error('the attr map of options is required'))//required
    //this.overlay;
    this.iconLayer = new ol.layer.Vector({
        source: new ol.source.Vector()
    });
    this._map.addLayer(this.iconLayer);
    this._setPopup();
}

BaseRoute.prototype.search = function (startPoint, endPoint) {
    var self = this;
    var url = this._transferUrl + "&origin=" + startPoint.join(',') + "&destination=" + endPoint.join(',');
    self._requestData(url, function (status, message) {
        if(status == 0){
            self._responseData = message;
            self._initPanel();
        }else {
            throw Error(message);
        }
    })
};

BaseRoute.prototype._requestData = function (url, cb) {
    this._responseData = {};
    var self = this;
    this.HTTPJsonP(url, function (json) {
        cb.call(self, json.status, 0 == json.status ? json : json.message);
    });
};


BaseRoute.prototype.HTTPJsonP = function (url, callback) {
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
};

BaseRoute.prototype._drawIcon = function (pointCollection) {
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

BaseRoute.prototype._addInteraction = function (aSelect) {
    var self = this;
    self._selects = aSelect;
    aSelect.forEach((select) => {
        self._map.addInteraction(select);
        select.on('select', function (e) {
            if (e.selected[0]) {
                // console.log(e);
                var step = e.selected[0].getProperties()["step"];
                var coordinate = e.mapBrowserEvent.coordinate;
                self._content.innerHTML =  step.dom.innerHTML ;
                self.overlay.setPosition(coordinate);
            } else {
                // close the overlay
                self._closer.dispatchEvent(new MouseEvent('click'));
            }
        });
    });
}

BaseRoute.prototype._setPopup = function () {
    var self = this;
    var elemPopup = document.createElement('div');
    elemPopup.id = "leador-popup";
    elemPopup.className = "leador-ol-popup";
    elemPopup.innerHTML = '<a href="#" id="leador-popup-closer" class="leador-ol-popup-closer"></a> <div id="leador-popup-content"></div>';
    document.body.appendChild(elemPopup);
    var container = document.getElementById('leador-popup');
    var content = document.getElementById('leador-popup-content');
    var closer = document.getElementById('leador-popup-closer');
    this._content = content;
    this._closer = closer;
    this.overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    }));
    closer.onclick = function () {
        self.overlay.setPosition(undefined);
        closer.blur();
        self._selects.forEach((select) => {
            select.getFeatures().clear();
        })
        return false;

    };
    this._map.addOverlay(this.overlay);
};

//var geoExtent = geometry.getExtent();
BaseRoute.prototype._fly2Geometry = function (geometry) {
    var extent = geometry.getExtent();
    var view = this._map.getView();
    /*
     4.0.0 release simplified ol.view#fit() API
    view.fit(extent, {
        size: this._map.getSize(),
        duration: 2000,
        easing: ol.easing.inAndOut
    })*/

    /**
     * 3.20.0 old API
     */
    view.fit(extent, this._map.getSize(), {
        duration: 2000,
        easing: ol.easing.inAndOut
    });
};

function flyTo(location, done) {
    var duration = 2000;
    var zoom = view.getZoom();
    var parts = 2;
    var called = false;
    function callback(complete) {
        --parts;
        if (called) {
            return;
        }
        if (parts === 0 || !complete) {
            called = true;
            done(complete);
        }
    }
    view.animate({
        center: location,
        duration: duration
    }, callback);
    view.animate({
        zoom: zoom - 1,
        duration: duration / 2
    }, {
        zoom: zoom,
        duration: duration / 2
    }, callback);
}


export default  BaseRoute;