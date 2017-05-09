goog.provide('ol.control.Control');

goog.require('ol');
goog.require('ol.MapEventType');
goog.require('ol.Object');
goog.require('ol.dom');
goog.require('ol.events');


/**
 * @classdesc
 * 控件是可见的小部件的DOM元素的固定位置
 * 屏幕上。他们可以涉及用户输入(按钮),或信息;
 * 使用CSS的位置决定。在默认情况下这些被放置
 * 容器用CSS类名“ol-overlaycontainer-stopevent”,但可以使用
 * 任何外界的DOM元素。
 *
 * @constructor
 * @extends {ol.Object}
 * @implements {oli.control.Control}
 * @param {olx.control.ControlOptions} options Control options.
 * @api
 */
ol.control.Control = function(options) {

  ol.Object.call(this);

  /**
   * @protected
   * @type {Element}
   */
  this.element = options.element ? options.element : null;

  /**
   * @private
   * @type {Element}
   */
  this.target_ = null;

  /**
   * @private
   * @type {ol.Map}
   */
  this.map_ = null;

  /**
   * @protected
   * @type {!Array.<ol.EventsKey>}
   */
  this.listenerKeys = [];

  /**
   * @type {function(ol.MapEvent)}
   */
  this.render = options.render ? options.render : ol.nullFunction;

  if (options.target) {
    this.setTarget(options.target);
  }

};
ol.inherits(ol.control.Control, ol.Object);


/**
 * @inheritDoc
 */
ol.control.Control.prototype.disposeInternal = function() {
  ol.dom.removeNode(this.element);
  ol.Object.prototype.disposeInternal.call(this);
};


/**
 * 获取地图相关控件
 * @return {ol.Map} Map.
 * @api
 */
ol.control.Control.prototype.getMap = function() {
  return this.map_;
};


/**
 * 删除控件从当前地图并将它附加到新地图。
 * 子类可以设置事件处理程序通知更改
 * 这里的地图。
 * @param {ol.Map} map Map.
 * @override
 * @api
 */
ol.control.Control.prototype.setMap = function(map) {
  if (this.map_) {
    ol.dom.removeNode(this.element);
  }
  for (var i = 0, ii = this.listenerKeys.length; i < ii; ++i) {
    ol.events.unlistenByKey(this.listenerKeys[i]);
  }
  this.listenerKeys.length = 0;
  this.map_ = map;
  if (this.map_) {
    var target = this.target_ ?
        this.target_ : map.getOverlayContainerStopEvent();
    target.appendChild(this.element);
    if (this.render !== ol.nullFunction) {
      this.listenerKeys.push(ol.events.listen(map,
          ol.MapEventType.POSTRENDER, this.render, this));
    }
    map.render();
  }
};


/**
 * 这个函数是用来设置一个目标元素的控件。它没有
 * 效果如果它被称为控件后添加到地图(即。
 * “setMap”后呼吁控件)。如果没有“目标”中设置
 * 选项传递到控件构造函数,如果不是叫做“setTarget”
 * 然后控件容器添加到地图的叠加。
 * @param {Element|string} target Target.
 * @api
 */
ol.control.Control.prototype.setTarget = function(target) {
  this.target_ = typeof target === 'string' ?
    document.getElementById(target) :
    target;
};
