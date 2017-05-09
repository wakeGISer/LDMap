/**
 * Created by wake on 2017/5/9/009.
 */

function FindParameters() {
    this.layerIds = null;
    this.returnGeometry = !1;
    this.searchText = "";
    this.searchFields = "";
    this.spatialReference = null;
    this.layers = null;
    this.contains = !0;
    this.layerDefinitions = null;
    this.outSpatialReference = null; // 输出几何的 投影
    this.dynamicLayerInfos = null;
}

var p = FindParameters.prototype;

p.toJson = function () {
    var result = {
        f: "json",
        searchText: this.searchText,
        contains: this.contains,
        returnGeometry: this.returnGeometry,
        sr: this.outSpatialReference,
        searchFields: this.searchFields.join(','),
        layers: this.layerIds.join(',')
    }
    return result;
};

export default FindParameters;
