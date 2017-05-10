/**
 * Created by Administrator on 2017/5/8/008.
 */

function IdentifyParameters() {
    // identify 的 geometry
    this.geometry = null;
    this.spatialReference = null;
    this.layerIds = null;
    this.tolerance = null;
    this.returnGeometry = !1;
    // identify 的范围
    this.mapExtent = null;
    this.layerOption = IdentifyParameters.LAYER_OPTION_TOP;
    this.width = 400;
    this.height = 400;
    this.dpi = 96;
    this.searchText  = "";
    this.searchFields = ""; // 如果不指定， 默认只查displayField
}

var p = IdentifyParameters.prototype;

p.toJson = function () {
    var geometry = this.geometry,
        extent = this.mapExtent,
        spatialRef = this.spatialReference;
    var geometryString = JSON.stringify(this.toEsriGeometry(geometry))
    var result = {
        f: "json",
        geometry: geometryString,
        tolerance: this.tolerance,
        returnGeometry: this.returnGeometry,
        mapExtent: JSON.stringify(this.toEsriExtent(extent)),
        imageDisplay: this.width + "," + this.height + "," + this.dpi,
        geometryType: this.getGeometryType(geometry),
        sr: spatialRef,
        layers: this.layerOption + ":" + this.layerIds.join(','),
        searchText: this.searchText,
        searchFields: this.searchFields
    };
    return result;
};

p.toEsriGeometry = function (geometry) {
    var type = geometry.getType();
    var esriJson = new ol.format.EsriJSON();
    switch (type) {
        case "LineString" :
            return {paths: esriJson.writeGeometryObject(geometry).paths, spatialReference: {wkid: 4326}};
        case "Point" :
            return {
                x: esriJson.writeGeometryObject(geometry).x,
                y: esriJson.writeGeometryObject(geometry).y,
                spatialReference: {wkid: 4326}
            };
        case "Polygon" :
            return {
                rings: esriJson.writeGeometryObject(geometry).rings,
                spatialReference: {wkid: 4326}
            };
        case "Circle" :
            this.tolerance = geometry.getRadius();
            return {
                x: geometry.getCenter()[0],
                y: geometry.getCenter()[1],
                spatialReference: {wkid: 4326}
            };
        default:
            break;
    }
};

p.toEsriExtent = function (extent) {
    return {
        xmin: extent[0],
        ymin: extent[1],
        xmax: extent[2],
        ymax: extent[3],
        spatialReference: {
            wkid: 4326
        }
    }
}

p.getGeometryType = function (geometry) {
    var type = geometry.getType();
    switch (type) {
        case "LineString" :
            return "esriGeometryPolyline";
        case "Point" :
            return "esriGeometryPoint";
        case "Polygon" :
            return "esriGeometryPolygon";
        default:
            break;
    }
}

IdentifyParameters.LAYER_OPTION_ALL = 'all';

IdentifyParameters.LAYER_OPTION_TOP = 'top';

export default IdentifyParameters;