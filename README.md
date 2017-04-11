# LDMap

# 准备

- 引入 openlayer3 的css 文件和 js文件
- 引入 ldMap.css popup.css
- 引入 olMa.js文件

## 页面结构
```
<div id="map"></div> // map 为地图div
<div id="panel"></div> //panel 为 公交ui组件div
```
## 初始化地图
```
 var raster = new ol.layer.Tile({
        source: new ol.source.OSM()
    });
    var map = new ol.Map({
        layers: [raster],
        target: 'map',// 地图div的 id
        view: new ol.View({
            center: [116.39362, 39.92435], //地图定位中心点
            projection: 'EPSG:4326',
            zoom: 12//缩放级别
        })
    });
```

## 使用LD sdk 的api的 公交线路功能

```
 var bus =  new L.Busline({
        map: map, //map 为openlayers ol.Map的实例
        panel: "panel"// 公交ui组件div 的id
    });

    bus.search([116.33357,39.97644],[116.39245,39.91134]) //参数为 起始点和 终止点的经纬度
```
