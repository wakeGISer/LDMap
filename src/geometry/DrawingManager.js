/**
 * Created by Administrator on 2017/5/9/009.
 */

export class DrawingManager {
    constructor(map, features) {
        this.map = map;
        this._isActive = false;
        this.draw = null;
        this.features = features;
    }

    start (type, callback, style) {
        if(!type) {
            return;
        }
        if(style != void 0){
            switch (type) {
                case "Point" :
                    style =  new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: 5,
                            fill: new ol.style.Fill({
                                color: '#ffcc33'
                            })
                        })
                    });
                    break;
                case "LineString" :
                    style = new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: '#ffcc33',
                            width: 2
                        })
                    });
                    break;
                case "Polygon" :
                    style = new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 255, 0.2)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#ffcc33',
                            width: 2
                        })
                    })
                    break;
                default: break;
            }
        }

        this.draw = new ol.interaction.Draw({
            type: type,
            features: this.features,
            style: style
        });
        this.draw.on("drawend", callback);
        this.map.addInteraction(this.draw);
    }

    end () {
        if(!this._isActive){
            return;
        }
        this._isActive = false;
        if(this.draw) {
            this.map.removeInteraction(this.draw);
        }
    }
}