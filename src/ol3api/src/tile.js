goog.provide('ol.layer.Tile');

goog.require('ol');
goog.require('ol.layer.Layer');
goog.require('ol.layer.TileProperty');
goog.require('ol.obj');
goog.require('ol.renderer.Type');
goog.require('ol.renderer.canvas.TileLayer');
goog.require('ol.renderer.webgl.TileLayer');


/**
 * @classdesc
 * 图层来源,提供预渲染,平铺的图像的网格
 * 缩放级别为特定resolution。
 * 请注意,任何属性设置的选项设置为{ @link ol.Object }
 * 属性层对象;例如,设置 title: 'My Title'
 * 选 项意味着 title 是可观察的（observable）,并具有 get/set 访问器。
 *
 * @constructor
 * @extends {ol.layer.Layer}
 * @fires ol.render.Event
 * @param {olx.layer.TileOptions=} opt_options Tile layer options.
 * @api
 */
ol.layer.Tile = function(opt_options) {
  var options = opt_options ? opt_options : {};

  var baseOptions = ol.obj.assign({}, options);

  delete baseOptions.preload;
  delete baseOptions.useInterimTilesOnError;
  ol.layer.Layer.call(this,  /** @type {olx.layer.LayerOptions} */ (baseOptions));

  this.setPreload(options.preload !== undefined ? options.preload : 0);
  this.setUseInterimTilesOnError(options.useInterimTilesOnError !== undefined ?
      options.useInterimTilesOnError : true);
};
ol.inherits(ol.layer.Tile, ol.layer.Layer);


/**
 * @inheritDoc
 */
ol.layer.Tile.prototype.createRenderer = function(mapRenderer) {
  var renderer = null;
  var type = mapRenderer.getType();
  if (ol.ENABLE_CANVAS && type === ol.renderer.Type.CANVAS) {
    renderer = new ol.renderer.canvas.TileLayer(this);
  } else if (ol.ENABLE_WEBGL && type === ol.renderer.Type.WEBGL) {
    renderer = new ol.renderer.webgl.TileLayer(/** @type {ol.renderer.webgl.Map} */ (mapRenderer), this);
  }
  return renderer;
};


/**
 * 返回的将要预加载的瓦片级别。
 * @return {number} The level to preload tiles up to.
 * @observable
 * @api
 */
ol.layer.Tile.prototype.getPreload = function() {
  return /** @type {number} */ (this.get(ol.layer.TileProperty.PRELOAD));
};


/**
 * Return the associated {@link ol.source.Tile tilesource} of the layer.
 * @function
 * @return {ol.source.Tile} Source.
 * @api
 */
ol.layer.Tile.prototype.getSource;


/**
 * 设置预加载的瓦片级别
 * @param {number} preload The level to preload tiles up to.
 * @observable
 * @api
 */
ol.layer.Tile.prototype.setPreload = function(preload) {
  this.set(ol.layer.TileProperty.PRELOAD, preload);
};


/**
 * 是否使用了错误的中间瓦片
 * @return {boolean} Use interim tiles on error.
 * @observable
 * @api
 */
ol.layer.Tile.prototype.getUseInterimTilesOnError = function() {
  return /** @type {boolean} */ (
      this.get(ol.layer.TileProperty.USE_INTERIM_TILES_ON_ERROR));
};


/**
 *
 * @param {boolean} useInterimTilesOnError Use interim tiles on error.
 * @observable
 * @api
 */
ol.layer.Tile.prototype.setUseInterimTilesOnError = function(useInterimTilesOnError) {
  this.set(
      ol.layer.TileProperty.USE_INTERIM_TILES_ON_ERROR, useInterimTilesOnError);
};
