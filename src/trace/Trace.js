/**
 * Created by Administrator on 2017/4/14/014.
 */


/**
 * Abstract Class
 * @param options
 * @constructor
 */
function Trace(options) {
    this._map = (options.map instance of ol.Map) || throw ("options.map is not ol.Map instance ");
    this.style = optoins.style || this._getDefaultStyle();
}


/**
 * get the default style for trace
 * includes start point/ end point / lineString Style
 * @private
 */
Trace.prototype._getDefaultStyle = function () {

}