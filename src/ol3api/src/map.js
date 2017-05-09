// FIXME recheck layer/map projection compatibility when projection changes
// FIXME layer renderers should skip when they can't reproject
// FIXME add tilt and height?

goog.provide('ol.Map');

goog.require('ol');
goog.require('ol.Collection');
goog.require('ol.CollectionEventType');
goog.require('ol.MapBrowserEvent');
goog.require('ol.MapBrowserEventHandler');
goog.require('ol.MapBrowserEventType');
goog.require('ol.MapEvent');
goog.require('ol.MapEventType');
goog.require('ol.MapProperty');
goog.require('ol.Object');
goog.require('ol.ObjectEventType');
goog.require('ol.TileQueue');
goog.require('ol.View');
goog.require('ol.ViewHint');
goog.require('ol.asserts');
goog.require('ol.control');
goog.require('ol.dom');
goog.require('ol.events');
goog.require('ol.events.Event');
goog.require('ol.events.EventType');
goog.require('ol.extent');
goog.require('ol.functions');
goog.require('ol.has');
goog.require('ol.interaction');
goog.require('ol.layer.Group');
goog.require('ol.obj');
goog.require('ol.proj.common');
goog.require('ol.renderer.Map');
goog.require('ol.renderer.Type');
goog.require('ol.renderer.canvas.Map');
goog.require('ol.renderer.webgl.Map');
goog.require('ol.size');
goog.require('ol.structs.PriorityQueue');
goog.require('ol.transform');


/**
 * @const
 * @type {string}
 */
ol.OL_URL = 'https://openlayers.org/';


/**
 * @const
 * @type {string}
 */
ol.OL_LOGO_URL = 'data:image/png;base64,' +
    'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAA3NCSVQICAjb4U/gAAAACXBI' +
    'WXMAAAHGAAABxgEXwfpGAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAA' +
    'AhNQTFRF////AP//AICAgP//AFVVQECA////K1VVSbbbYL/fJ05idsTYJFtbbcjbJllmZszW' +
    'WMTOIFhoHlNiZszTa9DdUcHNHlNlV8XRIVdiasrUHlZjIVZjaMnVH1RlIFRkH1RkH1ZlasvY' +
    'asvXVsPQH1VkacnVa8vWIVZjIFRjVMPQa8rXIVVkXsXRsNveIFVkIFZlIVVj3eDeh6GmbMvX' +
    'H1ZkIFRka8rWbMvXIFVkIFVjIFVkbMvWH1VjbMvWIFVlbcvWIFVla8vVIFVkbMvWbMvVH1Vk' +
    'bMvWIFVlbcvWIFVkbcvVbMvWjNPbIFVkU8LPwMzNIFVkbczWIFVkbsvWbMvXIFVkRnB8bcvW' +
    '2+TkW8XRIFVkIlZlJVloJlpoKlxrLl9tMmJwOWd0Omh1RXF8TneCT3iDUHiDU8LPVMLPVcLP' +
    'VcPQVsPPVsPQV8PQWMTQWsTQW8TQXMXSXsXRX4SNX8bSYMfTYcfTYsfTY8jUZcfSZsnUaIqT' +
    'acrVasrVa8jTa8rWbI2VbMvWbcvWdJObdcvUdszUd8vVeJaee87Yfc3WgJyjhqGnitDYjaar' +
    'ldPZnrK2oNbborW5o9bbo9fbpLa6q9ndrL3ArtndscDDutzfu8fJwN7gwt7gxc/QyuHhy+Hi' +
    'zeHi0NfX0+Pj19zb1+Tj2uXk29/e3uLg3+Lh3+bl4uXj4ufl4+fl5Ofl5ufl5ujm5+jmySDn' +
    'BAAAAFp0Uk5TAAECAgMEBAYHCA0NDg4UGRogIiMmKSssLzU7PkJJT1JTVFliY2hrdHZ3foSF' +
    'hYeJjY2QkpugqbG1tre5w8zQ09XY3uXn6+zx8vT09vf4+Pj5+fr6/P39/f3+gz7SsAAAAVVJ' +
    'REFUOMtjYKA7EBDnwCPLrObS1BRiLoJLnte6CQy8FLHLCzs2QUG4FjZ5GbcmBDDjxJBXDWxC' +
    'Brb8aM4zbkIDzpLYnAcE9VXlJSWlZRU13koIeW57mGx5XjoMZEUqwxWYQaQbSzLSkYGfKFSe' +
    '0QMsX5WbjgY0YS4MBplemI4BdGBW+DQ11eZiymfqQuXZIjqwyadPNoSZ4L+0FVM6e+oGI6g8' +
    'a9iKNT3o8kVzNkzRg5lgl7p4wyRUL9Yt2jAxVh6mQCogae6GmflI8p0r13VFWTHBQ0rWPW7a' +
    'hgWVcPm+9cuLoyy4kCJDzCm6d8PSFoh0zvQNC5OjDJhQopPPJqph1doJBUD5tnkbZiUEqaCn' +
    'B3bTqLTFG1bPn71kw4b+GFdpLElKIzRxxgYgWNYc5SCENVHKeUaltHdXx0dZ8uBI1hJ2UUDg' +
    'q82CM2MwKeibqAvSO7MCABq0wXEPiqWEAAAAAElFTkSuQmCC';


/**
 * @type {Array.<ol.renderer.Type>}
 * @const
 */
ol.DEFAULT_RENDERER_TYPES = [
  ol.renderer.Type.CANVAS,
  ol.renderer.Type.WEBGL
];


/**
 * @classdesc
 * ol.Map 是openlayers的核心地图组件. 为了渲染地图, a view,
 * 一个后者多个图层, 一个DOM容器 是必须需要的:
 *
 *     var map = new ol.Map({
 *       view: new ol.View({
 *         center: [0, 0],
 *         zoom: 1
 *       }),
 *       layers: [
 *         new ol.layer.Tile({
 *           source: new ol.source.OSM()
 *         })
 *       ],
 *       target: 'map'
 *     });
 *
 * 上面的代码片段用一个 map 通过 {@link ol.layer.Tile} 来展示
 * {@link ol.source.OSM} OSM 数据 然后通过DOM id为 ‘map’ 的元素来渲染地图
 *
 *
 * @constructor
 * @extends {ol.Object}
 * @param {olx.MapOptions} options Map options.
 * @fires ol.MapBrowserEvent
 * @fires ol.MapEvent
 * @fires ol.render.Event#postcompose
 * @fires ol.render.Event#precompose
 * @api
 */
ol.Map = function(options) {

  ol.Object.call(this);

  var optionsInternal = ol.Map.createOptionsInternal(options);

  /**
   * @type {boolean}
   * @private
   */
  this.loadTilesWhileAnimating_ =
      options.loadTilesWhileAnimating !== undefined ?
          options.loadTilesWhileAnimating : false;

  /**
   * @type {boolean}
   * @private
   */
  this.loadTilesWhileInteracting_ =
      options.loadTilesWhileInteracting !== undefined ?
          options.loadTilesWhileInteracting : false;

  /**
   * @private
   * @type {number}
   */
  this.pixelRatio_ = options.pixelRatio !== undefined ?
      options.pixelRatio : ol.has.DEVICE_PIXEL_RATIO;

  /**
   * @private
   * @type {Object.<string, string>}
   */
  this.logos_ = optionsInternal.logos;

  /**
   * @private
   * @type {number|undefined}
   */
  this.animationDelayKey_;

  /**
   * @private
   */
  this.animationDelay_ = function() {
    this.animationDelayKey_ = undefined;
    this.renderFrame_.call(this, Date.now()); // time => frameState.time
  }.bind(this);

  /**
   * @private
   * @type {ol.Transform}
   */
  this.coordinateToPixelTransform_ = ol.transform.create();

  /**
   * @private
   * @type {ol.Transform}
   */
  this.pixelToCoordinateTransform_ = ol.transform.create();

  /**
   * @private
   * @type {number}
   */
  this.frameIndex_ = 0;

  /**
   * @private
   * @type {?olx.FrameState}
   */
  this.frameState_ = null;

  /**
   * The extent at the previous 'moveend' event.
   * @private
   * @type {ol.Extent}
   */
  this.previousExtent_ = ol.extent.createEmpty();

  /**
   * @private
   * @type {?ol.EventsKey}
   */
  this.viewPropertyListenerKey_ = null;

  /**
   * @private
   * @type {?ol.EventsKey}
   */
  this.viewChangeListenerKey_ = null;

  /**
   * @private
   * @type {Array.<ol.EventsKey>}
   */
  this.layerGroupPropertyListenerKeys_ = null;

  /**
   * @private
   * @type {Element}
   */
  this.viewport_ = document.createElement('DIV');
  this.viewport_.className = 'ol-viewport' + (ol.has.TOUCH ? ' ol-touch' : '');
  this.viewport_.style.position = 'relative';
  this.viewport_.style.overflow = 'hidden';
  this.viewport_.style.width = '100%';
  this.viewport_.style.height = '100%';
  // prevent page zoom on IE >= 10 browsers
  this.viewport_.style.msTouchAction = 'none';
  this.viewport_.style.touchAction = 'none';

  /**
   * @private
   * @type {!Element}
   */
  this.overlayContainer_ = document.createElement('DIV');
  this.overlayContainer_.className = 'ol-overlaycontainer';
  this.viewport_.appendChild(this.overlayContainer_);

  /**
   * @private
   * @type {!Element}
   */
  this.overlayContainerStopEvent_ = document.createElement('DIV');
  this.overlayContainerStopEvent_.className = 'ol-overlaycontainer-stopevent';
  var overlayEvents = [
    ol.events.EventType.CLICK,
    ol.events.EventType.DBLCLICK,
    ol.events.EventType.MOUSEDOWN,
    ol.events.EventType.TOUCHSTART,
    ol.events.EventType.MSPOINTERDOWN,
    ol.MapBrowserEventType.POINTERDOWN,
    ol.events.EventType.MOUSEWHEEL,
    ol.events.EventType.WHEEL
  ];
  for (var i = 0, ii = overlayEvents.length; i < ii; ++i) {
    ol.events.listen(this.overlayContainerStopEvent_, overlayEvents[i],
        ol.events.Event.stopPropagation);
  }
  this.viewport_.appendChild(this.overlayContainerStopEvent_);

  /**
   * @private
   * @type {ol.MapBrowserEventHandler}
   */
  this.mapBrowserEventHandler_ = new ol.MapBrowserEventHandler(this);
  for (var key in ol.MapBrowserEventType) {
    ol.events.listen(this.mapBrowserEventHandler_, ol.MapBrowserEventType[key],
        this.handleMapBrowserEvent, this);
  }

  /**
   * @private
   * @type {Element|Document}
   */
  this.keyboardEventTarget_ = optionsInternal.keyboardEventTarget;

  /**
   * @private
   * @type {Array.<ol.EventsKey>}
   */
  this.keyHandlerKeys_ = null;

  ol.events.listen(this.viewport_, ol.events.EventType.WHEEL,
      this.handleBrowserEvent, this);
  ol.events.listen(this.viewport_, ol.events.EventType.MOUSEWHEEL,
      this.handleBrowserEvent, this);

  /**
   * @type {ol.Collection.<ol.control.Control>}
   * @private
   */
  this.controls_ = optionsInternal.controls;

  /**
   * @type {ol.Collection.<ol.interaction.Interaction>}
   * @private
   */
  this.interactions_ = optionsInternal.interactions;

  /**
   * @type {ol.Collection.<ol.Overlay>}
   * @private
   */
  this.overlays_ = optionsInternal.overlays;

  /**
   * A lookup of overlays by id.
   * @private
   * @type {Object.<string, ol.Overlay>}
   */
  this.overlayIdIndex_ = {};

  /**
   * @type {ol.renderer.Map}
   * @private
   */
  this.renderer_ = new /** @type {Function} */ (optionsInternal.rendererConstructor)(this.viewport_, this);

  /**
   * @type {function(Event)|undefined}
   * @private
   */
  this.handleResize_;

  /**
   * @private
   * @type {ol.Coordinate}
   */
  this.focus_ = null;

  /**
   * @private
   * @type {Array.<ol.PostRenderFunction>}
   */
  this.postRenderFunctions_ = [];

  /**
   * @private
   * @type {ol.TileQueue}
   */
  this.tileQueue_ = new ol.TileQueue(
      this.getTilePriority.bind(this),
      this.handleTileChange_.bind(this));

  /**
   * Uids of features to skip at rendering time.
   * @type {Object.<string, boolean>}
   * @private
   */
  this.skippedFeatureUids_ = {};

  //为 地图 实例对象注册监听事件
  ol.events.listen(
      this, ol.Object.getChangeEventType(ol.MapProperty.LAYERGROUP),
      this.handleLayerGroupChanged_, this);
  ol.events.listen(this, ol.Object.getChangeEventType(ol.MapProperty.VIEW),
      this.handleViewChanged_, this);
  ol.events.listen(this, ol.Object.getChangeEventType(ol.MapProperty.SIZE),
      this.handleSizeChanged_, this);
  ol.events.listen(this, ol.Object.getChangeEventType(ol.MapProperty.TARGET),
      this.handleTargetChanged_, this);

  // setProperties will trigger the rendering of the map if the map
  // is "defined" already.
  this.setProperties(optionsInternal.values);

  this.controls_.forEach(
      /**
       * @param {ol.control.Control} control Control.
       * @this {ol.Map}
       */
      function(control) {
        control.setMap(this);
      }, this);

  ol.events.listen(this.controls_, ol.CollectionEventType.ADD,
      /**
       * @param {ol.Collection.Event} event Collection event.
       */
      function(event) {
        event.element.setMap(this);
      }, this);

  ol.events.listen(this.controls_, ol.CollectionEventType.REMOVE,
      /**
       * @param {ol.Collection.Event} event Collection event.
       */
      function(event) {
        event.element.setMap(null);
      }, this);

  this.interactions_.forEach(
      /**
       * @param {ol.interaction.Interaction} interaction Interaction.
       * @this {ol.Map}
       */
      function(interaction) {
        interaction.setMap(this);
      }, this);

  ol.events.listen(this.interactions_, ol.CollectionEventType.ADD,
      /**
       * @param {ol.Collection.Event} event Collection event.
       */
      function(event) {
        event.element.setMap(this);
      }, this);

  ol.events.listen(this.interactions_, ol.CollectionEventType.REMOVE,
      /**
       * @param {ol.Collection.Event} event Collection event.
       */
      function(event) {
        event.element.setMap(null);
      }, this);

  this.overlays_.forEach(this.addOverlayInternal_, this);

  ol.events.listen(this.overlays_, ol.CollectionEventType.ADD,
      /**
       * @param {ol.Collection.Event} event Collection event.
       */
      function(event) {
        this.addOverlayInternal_(/** @type {ol.Overlay} */ (event.element));
      }, this);

  ol.events.listen(this.overlays_, ol.CollectionEventType.REMOVE,
      /**
       * @param {ol.Collection.Event} event Collection event.
       */
      function(event) {
        var overlay = /** @type {ol.Overlay} */ (event.element);
        var id = overlay.getId();
        if (id !== undefined) {
          delete this.overlayIdIndex_[id.toString()];
        }
        event.element.setMap(null);
      }, this);

};
ol.inherits(ol.Map, ol.Object);


/**
 * 向地图窗口组件添加控件.
 * @param {ol.control.Control} control Control.
 * @api
 */
ol.Map.prototype.addControl = function(control) {
  this.getControls().push(control);
};


/**
 * 添加制定的interation到地图
 * @param {ol.interaction.Interaction} interaction Interaction to add.
 * @api
 */
ol.Map.prototype.addInteraction = function(interaction) {
  this.getInteractions().push(interaction);
};


/**
 *将给定层添加到地图。如果你想添加一个层
 * 在堆栈中,使用“getLayers()和上可用的方法
 * {@link ol.Collection}.
 * @param {ol.layer.Base} layer Layer.
 * @api
 */
ol.Map.prototype.addLayer = function(layer) {
  var layers = this.getLayerGroup().getLayers();
  layers.push(layer);
};


/**
 * 将给定覆盖层添加到地图。
 * @param {ol.Overlay} overlay Overlay.
 * @api
 */
ol.Map.prototype.addOverlay = function(overlay) {
  this.getOverlays().push(overlay);
};


/**
 * 这组处理地图的叠加的变化。
 * @param {ol.Overlay} overlay Overlay.
 * @private
 */
ol.Map.prototype.addOverlayInternal_ = function(overlay) {
  var id = overlay.getId();
  if (id !== undefined) {
    this.overlayIdIndex_[id.toString()] = overlay;
  }
  overlay.setMap(this);
};


/**
 *
 * @inheritDoc
 */
ol.Map.prototype.disposeInternal = function() {
  this.mapBrowserEventHandler_.dispose();
  this.renderer_.dispose();
  ol.events.unlisten(this.viewport_, ol.events.EventType.WHEEL,
      this.handleBrowserEvent, this);
  ol.events.unlisten(this.viewport_, ol.events.EventType.MOUSEWHEEL,
      this.handleBrowserEvent, this);
  if (this.handleResize_ !== undefined) {
    window.removeEventListener(ol.events.EventType.RESIZE,
        this.handleResize_, false);
    this.handleResize_ = undefined;
  }
  if (this.animationDelayKey_) {
    cancelAnimationFrame(this.animationDelayKey_);
    this.animationDelayKey_ = undefined;
  }
  this.setTarget(null);
  ol.Object.prototype.disposeInternal.call(this);
};


/**
 * 检测要素相交一个像素视窗,并执行
 * 回调与每个交叉功能。层包含在检测
 * 通过“opt_layerFilter”配置。
 * @param {ol.Pixel} pixel Pixel.
 * @param {function(this: S, (ol.Feature|ol.render.Feature),
 *     ol.layer.Layer): T} callback Feature callback. The callback will be
 *     called with two arguments. The first argument is one
 *     {@link ol.Feature feature} or
 *     {@link ol.render.Feature render feature} at the pixel, the second is
 *     the {@link ol.layer.Layer layer} of the feature and will be null for
 *     unmanaged layers. To stop detection, callback functions can return a
 *     truthy value.
 * @param {olx.AtPixelOptions=} opt_options Optional options.
 * @return {T|undefined} Callback result, i.e. the return value of last
 * callback execution, or the first truthy callback return value.
 * @template S,T
 * @api
 */
ol.Map.prototype.forEachFeatureAtPixel = function(pixel, callback, opt_options) {
  if (!this.frameState_) {
    return;
  }
  var coordinate = this.getCoordinateFromPixel(pixel);
  opt_options = opt_options !== undefined ? opt_options : {};
  var hitTolerance = opt_options.hitTolerance !== undefined ?
    opt_options.hitTolerance * this.frameState_.pixelRatio : 0;
  var layerFilter = opt_options.layerFilter !== undefined ?
    opt_options.layerFilter : ol.functions.TRUE;
    // 通过 new 出来的 ol.renderer.Map ---》 this.renderer_
  return this.renderer_.forEachFeatureAtCoordinate(
      coordinate, this.frameState_, hitTolerance, callback, null,
      layerFilter, null);
};


/**
 * 检测层有一个像素的颜色值窗口,和
 * 执行回调与每个匹配层。层包含在
 * 检测可以通过“opt_layerFilter”配置。
 * @param {ol.Pixel} pixel Pixel.
 * @param {function(this: S, ol.layer.Layer, (Uint8ClampedArray|Uint8Array)): T} callback
 *     Layer callback. This callback will recieve two arguments: first is the
 *     {@link ol.layer.Layer layer}, second argument is an array representing
 *     [R, G, B, A] pixel values (0 - 255) and will be `null` for layer types
 *     that do not currently support this argument. To stop detection, callback
 *     functions can return a truthy value.
 * @param {S=} opt_this Value to use as `this` when executing `callback`.
 * @param {(function(this: U, ol.layer.Layer): boolean)=} opt_layerFilter Layer
 *     filter function. The filter function will receive one argument, the
 *     {@link ol.layer.Layer layer-candidate} and it should return a boolean
 *     value. Only layers which are visible and for which this function returns
 *     `true` will be tested for features. By default, all visible layers will
 *     be tested.
 * @param {U=} opt_this2 Value to use as `this` when executing `layerFilter`.
 * @return {T|undefined} Callback result, i.e. the return value of last
 * callback execution, or the first truthy callback return value.
 * @template S,T,U
 * @api
 */
ol.Map.prototype.forEachLayerAtPixel = function(pixel, callback, opt_this, opt_layerFilter, opt_this2) {
  if (!this.frameState_) {
    return;
  }
  var thisArg = opt_this !== undefined ? opt_this : null;
  var layerFilter = opt_layerFilter !== undefined ?
      opt_layerFilter : ol.functions.TRUE;
  var thisArg2 = opt_this2 !== undefined ? opt_this2 : null;
  return this.renderer_.forEachLayerAtPixel(
      pixel, this.frameState_, callback, thisArg,
      layerFilter, thisArg2);
};


/**
 * 检测要素相交一个像素的窗口。层包含在
 * 检测可以通过“opt_layerFilter”配置。
 * @param {ol.Pixel} pixel Pixel.
 * @param {olx.AtPixelOptions=} opt_options Optional options.
 * @return {boolean} Is there a feature at the given pixel?
 * @template U
 * @api
 */
ol.Map.prototype.hasFeatureAtPixel = function(pixel, opt_options) {
  if (!this.frameState_) {
    return false;
  }
  var coordinate = this.getCoordinateFromPixel(pixel);
  opt_options = opt_options !== undefined ? opt_options : {};
  var layerFilter = opt_options.layerFilter !== undefined ?
      opt_options.layerFilter : ol.functions.TRUE;
  var hitTolerance = opt_options.hitTolerance !== undefined ?
    opt_options.hitTolerance * this.frameState_.pixelRatio : 0;
  return this.renderer_.hasFeatureAtCoordinate(
      coordinate, this.frameState_, hitTolerance, layerFilter, null);
};


/**
 * 返回浏览器事件视图投影的坐标。
 * @param {Event} event Event.
 * @return {ol.Coordinate} Coordinate.
 * @api
 */
ol.Map.prototype.getEventCoordinate = function(event) {
  return this.getCoordinateFromPixel(this.getEventPixel(event));
};


/**
 * 返回地图像素位置事件相对于浏览器窗口。
 * @param {Event} event Event.
 * @return {ol.Pixel} Pixel.
 * @api
 */
ol.Map.prototype.getEventPixel = function(event) {
  var viewportPosition = this.viewport_.getBoundingClientRect();
  var eventPosition = event.changedTouches ? event.changedTouches[0] : event;
  return [
    eventPosition.clientX - viewportPosition.left,
    eventPosition.clientY - viewportPosition.top
  ];
};


/**
 * 这张地图显示的目标。
 * 请注意,这将返回在setTarget进入作为一个选项,或者是什么:
 * 如果这是一个元素,它返回一个元素;如果一个字符串,则返回。
 * @return {Element|string|undefined} The Element or id of the Element that the
 *     map is rendered in.
 * @observable
 * @api
 */
ol.Map.prototype.getTarget = function() {
  return /** @type {Element|string|undefined} */ (
      this.get(ol.MapProperty.TARGET));
};


/**
 * 得到这张地图显示的DOM元素。相比
 * “getTarget”这个方法总是返回一个“元素”,或“null”
 * 地图没有目标。
 * @return {Element} The element that the map is rendered in.
 * @api
 */
ol.Map.prototype.getTargetElement = function() {
  var target = this.getTarget();
  if (target !== undefined) {
    return typeof target === 'string' ?
      document.getElementById(target) :
      target;
  } else {
    return null;
  }
};


/**
 * 获得一个给定的像素坐标。这将返回一个坐标
 * 地图视图投影。
 * @param {ol.Pixel} pixel Pixel position in the map viewport.
 * @return {ol.Coordinate} The coordinate for the pixel position.
 * @api
 */
ol.Map.prototype.getCoordinateFromPixel = function(pixel) {
  var frameState = this.frameState_;
  if (!frameState) {
    return null;
  } else {
    return ol.transform.apply(frameState.pixelToCoordinateTransform, pixel.slice());
  }
};


/**
 * 得到地图控件。修改该集合变化控制
 * 相关的地图。
 * @return {ol.Collection.<ol.control.Control>} Controls.
 * @api
 */
ol.Map.prototype.getControls = function() {
  return this.controls_;
};


/**
 * 得到地图覆盖。修改这个集合覆盖的变化
 * 相关的地图。
 * @return {ol.Collection.<ol.Overlay>} Overlays.
 * @api
 */
ol.Map.prototype.getOverlays = function() {
  return this.overlays_;
};


/**
 * 得到一个叠加的标识符(overlay.getId返回的值())。
 * 请注意,该指数将字符串和数字标识符视为相同。所以
 * ’map.getOverlayById(2)将返回一个覆盖id为“2”或“2”。
 * @param {string|number} id Overlay identifier.
 * @return {ol.Overlay} Overlay.
 * @api
 */
ol.Map.prototype.getOverlayById = function(id) {
  var overlay = this.overlayIdIndex_[id.toString()];
  return overlay !== undefined ? overlay : null;
};


/**
 * 得到地图的交互。修改这个集合的交互变化
 * 相关的地图。
 *
 * Interactions are used for e.g. pan, zoom and rotate.
 * @return {ol.Collection.<ol.interaction.Interaction>} Interactions.
 * @api
 */
ol.Map.prototype.getInteractions = function() {
  return this.interactions_;
};


/**
 * layergroup与这张地图。
 * @return {ol.layer.Group} A layer group containing the layers in this map.
 * @observable
 * @api
 */
ol.Map.prototype.getLayerGroup = function() {
  return /** @type {ol.layer.Group} */ (this.get(ol.MapProperty.LAYERGROUP));
};


/**
 *收集与地图相关的层。
 * @return {!ol.Collection.<ol.layer.Base>} Layers.
 * @api
 */
ol.Map.prototype.getLayers = function() {
  var layers = this.getLayerGroup().getLayers();
  return layers;
};


/**
 * 得到的像素坐标。这需要一个坐标在地图视图
 * 投影并返回对应的像素。
 * @param {ol.Coordinate} coordinate A map coordinate.
 * @return {ol.Pixel} A pixel position in the map viewport.
 * @api
 */
ol.Map.prototype.getPixelFromCoordinate = function(coordinate) {
  var frameState = this.frameState_;
  if (!frameState) {
    return null;
  } else {
    return ol.transform.apply(frameState.coordinateToPixelTransform,
        coordinate.slice(0, 2));
  }
};


/**
 * 得到地图渲染器。
 * @return {ol.renderer.Map} Renderer
 */
ol.Map.prototype.getRenderer = function() {
  return this.renderer_;
};


/**
 * 这张地图的大小。
 * @return {ol.Size|undefined} The size in pixels of the map in the DOM.
 * @observable
 * @api
 */
ol.Map.prototype.getSize = function() {
  return /** @type {ol.Size|undefined} */ (this.get(ol.MapProperty.SIZE));
};


/**
 * 得到与地图相关的视图。一个视图管理属性等
 * 中心和决议。
 * @return {ol.View} The view that controls this map.
 * @observable
 * @api
 */
ol.Map.prototype.getView = function() {
  return /** @type {ol.View} */ (this.get(ol.MapProperty.VIEW));
};


/**
 * 得到的元素作为地图视窗。
 * @return {Element} Viewport.
 * @api
 */
ol.Map.prototype.getViewport = function() {
  return this.viewport_;
};


/**
 * 得到的元素作为覆盖的容器。元素添加到
 * 这个容器将让mousedown和touchstart事件通过地图,
 * 所以覆盖将触发点击和手势 {@link ol.MapBrowserEvent}
 * events.
 * @return {!Element} The map's overlay container.
 */
ol.Map.prototype.getOverlayContainer = function() {
  return this.overlayContainer_;
};


/**
 * 得到的元素作为一个容器不允许的覆盖
 * 事件传播。元素添加到这个容器不会让mousedown和
 *  touchstart事件通过地图,所以点击叠加和手势
 * 不触发任何{@link ol.MapBrowserEvent}.
 * @return {!Element} The map's overlay container that stops events.
 */
ol.Map.prototype.getOverlayContainerStopEvent = function() {
  return this.overlayContainerStopEvent_;
};


/**
 * @param {ol.Tile} tile Tile.
 * @param {string} tileSourceKey Tile source key.
 * @param {ol.Coordinate} tileCenter Tile center.
 * @param {number} tileResolution Tile resolution.
 * @return {number} Tile priority.
 */
ol.Map.prototype.getTilePriority = function(tile, tileSourceKey, tileCenter, tileResolution) {
  // Filter out tiles at higher zoom levels than the current zoom level, or that
  // are outside the visible extent.
  var frameState = this.frameState_;
  if (!frameState || !(tileSourceKey in frameState.wantedTiles)) {
    return ol.structs.PriorityQueue.DROP;
  }
  if (!frameState.wantedTiles[tileSourceKey][tile.getKey()]) {
    return ol.structs.PriorityQueue.DROP;
  }
  // Prioritize the highest zoom level tiles closest to the focus.
  // Tiles at higher zoom levels are prioritized using Math.log(tileResolution).
  // Within a zoom level, tiles are prioritized by the distance in pixels
  // between the center of the tile and the focus.  The factor of 65536 means
  // that the prioritization should behave as desired for tiles up to
  // 65536 * Math.log(2) = 45426 pixels from the focus.
  var deltaX = tileCenter[0] - frameState.focus[0];
  var deltaY = tileCenter[1] - frameState.focus[1];
  return 65536 * Math.log(tileResolution) +
      Math.sqrt(deltaX * deltaX + deltaY * deltaY) / tileResolution;
};


/**
 * @param {Event} browserEvent Browser event.
 * @param {string=} opt_type Type.
 */
ol.Map.prototype.handleBrowserEvent = function(browserEvent, opt_type) {
  var type = opt_type || browserEvent.type;
  var mapBrowserEvent = new ol.MapBrowserEvent(type, this, browserEvent);
  this.handleMapBrowserEvent(mapBrowserEvent);
};


/**
 * @param {ol.MapBrowserEvent} mapBrowserEvent The event to handle.
 */
ol.Map.prototype.handleMapBrowserEvent = function(mapBrowserEvent) {
  if (!this.frameState_) {
    // With no view defined, we cannot translate pixels into geographical
    // coordinates so interactions cannot be used.
    return;
  }
  this.focus_ = mapBrowserEvent.coordinate;
  mapBrowserEvent.frameState = this.frameState_;
  var interactionsArray = this.getInteractions().getArray();
  var i;
  if (this.dispatchEvent(mapBrowserEvent) !== false) {
    for (i = interactionsArray.length - 1; i >= 0; i--) {
      var interaction = interactionsArray[i];
      if (!interaction.getActive()) {
        continue;
      }
      var cont = interaction.handleEvent(mapBrowserEvent);
      if (!cont) {
        break;
      }
    }
  }
};


/**
 * @protected
 */
ol.Map.prototype.handlePostRender = function() {

  var frameState = this.frameState_;

  // Manage the tile queue
  // Image loads are expensive and a limited resource, so try to use them
  // efficiently:
  // * When the view is static we allow a large number of parallel tile loads
  //   to complete the frame as quickly as possible.
  // * When animating or interacting, image loads can cause janks, so we reduce
  //   the maximum number of loads per frame and limit the number of parallel
  //   tile loads to remain reactive to view changes and to reduce the chance of
  //   loading tiles that will quickly disappear from view.
  var tileQueue = this.tileQueue_;
  if (!tileQueue.isEmpty()) {
    var maxTotalLoading = 16;
    var maxNewLoads = maxTotalLoading;
    if (frameState) {
      var hints = frameState.viewHints;
      if (hints[ol.ViewHint.ANIMATING]) {
        maxTotalLoading = this.loadTilesWhileAnimating_ ? 8 : 0;
        maxNewLoads = 2;
      }
      if (hints[ol.ViewHint.INTERACTING]) {
        maxTotalLoading = this.loadTilesWhileInteracting_ ? 8 : 0;
        maxNewLoads = 2;
      }
    }
    if (tileQueue.getTilesLoading() < maxTotalLoading) {
      tileQueue.reprioritize(); // FIXME only call if view has changed
      tileQueue.loadMoreTiles(maxTotalLoading, maxNewLoads);
    }
  }

  var postRenderFunctions = this.postRenderFunctions_;
  var i, ii;
  for (i = 0, ii = postRenderFunctions.length; i < ii; ++i) {
    postRenderFunctions[i](this, frameState);
  }
  postRenderFunctions.length = 0;
};


/**
 * @private
 */
ol.Map.prototype.handleSizeChanged_ = function() {
  this.render();
};


/**
 * @private
 */
ol.Map.prototype.handleTargetChanged_ = function() {
  // target may be undefined, null, a string or an Element.
  // If it's a string we convert it to an Element before proceeding.
  // If it's not now an Element we remove the viewport from the DOM.
  // If it's an Element we append the viewport element to it.

  var targetElement;
  if (this.getTarget()) {
    targetElement = this.getTargetElement();
  }

  if (this.keyHandlerKeys_) {
    for (var i = 0, ii = this.keyHandlerKeys_.length; i < ii; ++i) {
      ol.events.unlistenByKey(this.keyHandlerKeys_[i]);
    }
    this.keyHandlerKeys_ = null;
  }

  if (!targetElement) {
    ol.dom.removeNode(this.viewport_);
    if (this.handleResize_ !== undefined) {
      window.removeEventListener(ol.events.EventType.RESIZE,
          this.handleResize_, false);
      this.handleResize_ = undefined;
    }
  } else {
    targetElement.appendChild(this.viewport_);

    var keyboardEventTarget = !this.keyboardEventTarget_ ?
        targetElement : this.keyboardEventTarget_;
    this.keyHandlerKeys_ = [
      ol.events.listen(keyboardEventTarget, ol.events.EventType.KEYDOWN,
          this.handleBrowserEvent, this),
      ol.events.listen(keyboardEventTarget, ol.events.EventType.KEYPRESS,
          this.handleBrowserEvent, this)
    ];

    if (!this.handleResize_) {
      this.handleResize_ = this.updateSize.bind(this);
      window.addEventListener(ol.events.EventType.RESIZE,
          this.handleResize_, false);
    }
  }

  this.updateSize();
  // updateSize calls setSize, so no need to call this.render
  // ourselves here.
};


/**
 * @private
 */
ol.Map.prototype.handleTileChange_ = function() {
  this.render();
};


/**
 * @private
 */
ol.Map.prototype.handleViewPropertyChanged_ = function() {
  this.render();
};


/**
 * @private
 */
ol.Map.prototype.handleViewChanged_ = function() {
  if (this.viewPropertyListenerKey_) {
    ol.events.unlistenByKey(this.viewPropertyListenerKey_);
    this.viewPropertyListenerKey_ = null;
  }
  if (this.viewChangeListenerKey_) {
    ol.events.unlistenByKey(this.viewChangeListenerKey_);
    this.viewChangeListenerKey_ = null;
  }
  var view = this.getView();
  if (view) {
    this.viewport_.setAttribute('data-view', ol.getUid(view));
    this.viewPropertyListenerKey_ = ol.events.listen(
        view, ol.ObjectEventType.PROPERTYCHANGE,
        this.handleViewPropertyChanged_, this);
    this.viewChangeListenerKey_ = ol.events.listen(
        view, ol.events.EventType.CHANGE,
        this.handleViewPropertyChanged_, this);
  }
  this.render();
};


/**
 * @private
 */
ol.Map.prototype.handleLayerGroupChanged_ = function() {
  if (this.layerGroupPropertyListenerKeys_) {
    this.layerGroupPropertyListenerKeys_.forEach(ol.events.unlistenByKey);
    this.layerGroupPropertyListenerKeys_ = null;
  }
  var layerGroup = this.getLayerGroup();
  if (layerGroup) {
    this.layerGroupPropertyListenerKeys_ = [
      ol.events.listen(
          layerGroup, ol.ObjectEventType.PROPERTYCHANGE,
          this.render, this),
      ol.events.listen(
          layerGroup, ol.events.EventType.CHANGE,
          this.render, this)
    ];
  }
  this.render();
};


/**
 * @return {boolean} Is rendered.
 */
ol.Map.prototype.isRendered = function() {
  return !!this.frameState_;
};


/**
 * Requests an immediate render in a synchronous manner.
 * @api
 */
ol.Map.prototype.renderSync = function() {
  if (this.animationDelayKey_) {
    cancelAnimationFrame(this.animationDelayKey_);
  }
  this.animationDelay_();
};


/**
 * Request a map rendering (at the next animation frame).
 * @api
 */
ol.Map.prototype.render = function() {
  if (this.animationDelayKey_ === undefined) {
    this.animationDelayKey_ = requestAnimationFrame(
        this.animationDelay_);
  }
};


/**
 * Remove the given control from the map.
 * @param {ol.control.Control} control Control.
 * @return {ol.control.Control|undefined} The removed control (or undefined
 *     if the control was not found).
 * @api
 */
ol.Map.prototype.removeControl = function(control) {
  return this.getControls().remove(control);
};


/**
 * 从地图中删除给定的交互。
 * @param {ol.interaction.Interaction} interaction Interaction to remove.
 * @return {ol.interaction.Interaction|undefined} The removed interaction (or
 *     undefined if the interaction was not found).
 * @api
 */
ol.Map.prototype.removeInteraction = function(interaction) {
  return this.getInteractions().remove(interaction);
};


/**
 * 从地图中删除给定的层。
 * @param {ol.layer.Base} layer Layer.
 * @return {ol.layer.Base|undefined} The removed layer (or undefined if the
 *     layer was not found).
 * @api
 */
ol.Map.prototype.removeLayer = function(layer) {
  var layers = this.getLayerGroup().getLayers();
  return layers.remove(layer);
};


/**
 * 从地图中删除给定的叠加。
 * @param {ol.Overlay} overlay Overlay.
 * @return {ol.Overlay|undefined} The removed overlay (or undefined
 *     if the overlay was not found).
 * @api
 */
ol.Map.prototype.removeOverlay = function(overlay) {
  return this.getOverlays().remove(overlay);
};


/**
 * @param {number} time Time.
 * requestAnimation -> animationDelay_
 * @private
 */
ol.Map.prototype.renderFrame_ = function(time) {
  var i, ii, viewState;

  var size = this.getSize();
  var view = this.getView();
  var extent = ol.extent.createEmpty();
  /** @type {?olx.FrameState} */
  var frameState = null;
  if (size !== undefined && ol.size.hasArea(size) && view && view.isDef()) {
    var viewHints = view.getHints(this.frameState_ ? this.frameState_.viewHints : undefined);
    var layerStatesArray = this.getLayerGroup().getLayerStatesArray();
    var layerStates = {};
    for (i = 0, ii = layerStatesArray.length; i < ii; ++i) {
      layerStates[ol.getUid(layerStatesArray[i].layer)] = layerStatesArray[i];
    }
    viewState = view.getState();
    frameState = /** @type {olx.FrameState} */ ({
      animate: false,
      attributions: {},
      coordinateToPixelTransform: this.coordinateToPixelTransform_,
      extent: extent,
      focus: !this.focus_ ? viewState.center : this.focus_,
      index: this.frameIndex_++,
      layerStates: layerStates,
      layerStatesArray: layerStatesArray,
      logos: ol.obj.assign({}, this.logos_),
      pixelRatio: this.pixelRatio_,
      pixelToCoordinateTransform: this.pixelToCoordinateTransform_,
      postRenderFunctions: [],
      size: size,
      skippedFeatureUids: this.skippedFeatureUids_,
      tileQueue: this.tileQueue_,
      time: time,
      usedTiles: {},
      viewState: viewState,
      viewHints: viewHints,
      wantedTiles: {}
    });
  }

  if (frameState) {
    // 根据墨卡托中心点坐标 和  resolution 获取当前浏览器视图窗口内的 extent
    frameState.extent = ol.extent.getForViewAndSize(viewState.center,
        viewState.resolution, viewState.rotation, frameState.size, extent);
  }

  this.frameState_ = frameState;
  // 此处 默认是 ol.renderer.canvas.Map
  this.renderer_.renderFrame(frameState);

  if (frameState) {
    if (frameState.animate) {
      this.render();
    }
    Array.prototype.push.apply(
        this.postRenderFunctions_, frameState.postRenderFunctions);

    var idle = !frameState.viewHints[ol.ViewHint.ANIMATING] &&
        !frameState.viewHints[ol.ViewHint.INTERACTING] &&
        !ol.extent.equals(frameState.extent, this.previousExtent_);

    if (idle) {
      this.dispatchEvent(
          new ol.MapEvent(ol.MapEventType.MOVEEND, this, frameState));
      ol.extent.clone(frameState.extent, this.previousExtent_);
    }
  }

  this.dispatchEvent(
      new ol.MapEvent(ol.MapEventType.POSTRENDER, this, frameState));

  setTimeout(this.handlePostRender.bind(this), 0);

};


/**
 * 这个地图的layergroup集。
 * @param {ol.layer.Group} layerGroup A layer group containing the layers in
 *     this map.
 * @observable
 * @api
 */
ol.Map.prototype.setLayerGroup = function(layerGroup) {
  this.set(ol.MapProperty.LAYERGROUP, layerGroup);
};


/**
 * 这张地图的大小。
 * @param {ol.Size|undefined} size The size in pixels of the map in the DOM.
 * @observable
 * @api
 */
ol.Map.prototype.setSize = function(size) {
  this.set(ol.MapProperty.SIZE, size);
};


/**
 * 设置这个映射到目标元素呈现。
 * @param {Element|string|undefined} target The Element or id of the Element
 *     that the map is rendered in.
 * @observable
 * @api
 */
ol.Map.prototype.setTarget = function(target) {
  this.set(ol.MapProperty.TARGET, target);
};


/**
 * 为这张地图设置视图。
 * @param {ol.View} view The view that controls this map.
 * @observable
 * @api
 */
ol.Map.prototype.setView = function(view) {
  this.set(ol.MapProperty.VIEW, view);
};


/**
 * @param {ol.Feature} feature Feature.
 */
ol.Map.prototype.skipFeature = function(feature) {
  var featureUid = ol.getUid(feature).toString();
  this.skippedFeatureUids_[featureUid] = true;
  this.render();
};


/**
 * 力量的重新计算地图窗口的大小。这应该时调用
 * 第三方代码更改地图窗口的大小。
 * @api
 */
ol.Map.prototype.updateSize = function() {
  var targetElement = this.getTargetElement();

  if (!targetElement) {
    this.setSize(undefined);
  } else {
    var computedStyle = getComputedStyle(targetElement);
    this.setSize([
      targetElement.offsetWidth -
          parseFloat(computedStyle['borderLeftWidth']) -
          parseFloat(computedStyle['paddingLeft']) -
          parseFloat(computedStyle['paddingRight']) -
          parseFloat(computedStyle['borderRightWidth']),
      targetElement.offsetHeight -
          parseFloat(computedStyle['borderTopWidth']) -
          parseFloat(computedStyle['paddingTop']) -
          parseFloat(computedStyle['paddingBottom']) -
          parseFloat(computedStyle['borderBottomWidth'])
    ]);
  }
};


/**
 * @param {ol.Feature} feature Feature.
 */
ol.Map.prototype.unskipFeature = function(feature) {
  var featureUid = ol.getUid(feature).toString();
  delete this.skippedFeatureUids_[featureUid];
  this.render();
};


/**
 * @param {olx.MapOptions} options Map options.
 * @return {ol.MapOptionsInternal} Internal map options.
 */
ol.Map.createOptionsInternal = function(options) {

  /**
   * @type {Element|Document}
   */
  var keyboardEventTarget = null;
  if (options.keyboardEventTarget !== undefined) {
    keyboardEventTarget = typeof options.keyboardEventTarget === 'string' ?
        document.getElementById(options.keyboardEventTarget) :
        options.keyboardEventTarget;
  }

  /**
   * @type {Object.<string, *>}
   */
  var values = {};

  var logos = {};
  if (options.logo === undefined ||
      (typeof options.logo === 'boolean' && options.logo)) {
    logos[ol.OL_LOGO_URL] = ol.OL_URL;
  } else {
    var logo = options.logo;
    if (typeof logo === 'string') {
      logos[logo] = '';
    } else if (logo instanceof HTMLElement) {
      logos[ol.getUid(logo).toString()] = logo;
    } else if (logo) {
      ol.asserts.assert(typeof logo.href == 'string', 44); // `logo.href` should be a string.
      ol.asserts.assert(typeof logo.src == 'string', 45); // `logo.src` should be a string.
      logos[logo.src] = logo.href;
    }
  }

  // 创建图层组
  var layerGroup = (options.layers instanceof ol.layer.Group) ?
      options.layers : new ol.layer.Group({layers: options.layers})

  values[ol.MapProperty.LAYERGROUP] = layerGroup;

  values[ol.MapProperty.TARGET] = options.target;

  values[ol.MapProperty.VIEW] = options.view !== undefined ?
      options.view : new ol.View();

  /**
   * @type {function(new: ol.renderer.Map, Element, ol.Map)}
   */
  var rendererConstructor = ol.renderer.Map;

  /**
   * @type {Array.<ol.renderer.Type>}
   */
  var rendererTypes;
  if (options.renderer !== undefined) {
    if (Array.isArray(options.renderer)) {
      rendererTypes = options.renderer;
    } else if (typeof options.renderer === 'string') {
      rendererTypes = [options.renderer];
    } else {
      ol.asserts.assert(false, 46); // Incorrect format for `renderer` option
    }
    if (rendererTypes.indexOf(/** @type {ol.renderer.Type} */ ('dom')) >= 0) {
      rendererTypes = rendererTypes.concat(ol.DEFAULT_RENDERER_TYPES);
    }
  } else {
    rendererTypes = ol.DEFAULT_RENDERER_TYPES;
    /*
      ol.DEFAULT_RENDERER_TYPES = [
        ol.renderer.Type.CANVAS,
        ol.renderer.Type.webgl
      ];
     */
  }

  var i, ii;
  for (i = 0, ii = rendererTypes.length; i < ii; ++i) {
    /** @type {ol.renderer.Type} */
    var rendererType = rendererTypes[i];
    if (ol.ENABLE_CANVAS && rendererType == ol.renderer.Type.CANVAS) {
      if (ol.has.CANVAS) {
        rendererConstructor = ol.renderer.canvas.Map;
        break;
      }
    } else if (ol.ENABLE_WEBGL && rendererType == ol.renderer.Type.WEBGL) {
      if (ol.has.WEBGL) {
        rendererConstructor = ol.renderer.webgl.Map;
        break;
      }
    }
  }

  var controls;
  if (options.controls !== undefined) {
    if (Array.isArray(options.controls)) {
      controls = new ol.Collection(options.controls.slice());
    } else {
      ol.asserts.assert(options.controls instanceof ol.Collection,
          47); // Expected `controls` to be an array or an `ol.Collection`
      controls = options.controls;
    }
  } else {
    controls = ol.control.defaults();
  }

  var interactions;
  if (options.interactions !== undefined) {
    if (Array.isArray(options.interactions)) {
      interactions = new ol.Collection(options.interactions.slice());
    } else {
      ol.asserts.assert(options.interactions instanceof ol.Collection,
          48); // Expected `interactions` to be an array or an `ol.Collection`
      interactions = options.interactions;
    }
  } else {
    interactions = ol.interaction.defaults();
  }

  var overlays;
  if (options.overlays !== undefined) {
    if (Array.isArray(options.overlays)) {
      overlays = new ol.Collection(options.overlays.slice());
    } else {
      ol.asserts.assert(options.overlays instanceof ol.Collection,
          49); // Expected `overlays` to be an array or an `ol.Collection`
      overlays = options.overlays;
    }
  } else {
    overlays = new ol.Collection();
  }

  return {
    controls: controls,
    interactions: interactions,
    keyboardEventTarget: keyboardEventTarget,
    logos: logos,
    overlays: overlays,
    rendererConstructor: rendererConstructor,
    values: values
  };

};

ol.proj.common.add();
