goog.provide('ol.geom.LineString');

goog.require('ol');
goog.require('ol.array');
goog.require('ol.extent');
goog.require('ol.geom.GeometryLayout');
goog.require('ol.geom.GeometryType');
goog.require('ol.geom.SimpleGeometry');
goog.require('ol.geom.flat.closest');
goog.require('ol.geom.flat.deflate');
goog.require('ol.geom.flat.inflate');
goog.require('ol.geom.flat.interpolate');
goog.require('ol.geom.flat.intersectsextent');
goog.require('ol.geom.flat.length');
goog.require('ol.geom.flat.segments');
goog.require('ol.geom.flat.simplify');


/**
 * @classdesc
 * 线几何对象
 *
 * @constructor
 * @extends {ol.geom.SimpleGeometry}
 * @param {Array.<ol.Coordinate>} coordinates Coordinates.
 * @param {ol.geom.GeometryLayout=} opt_layout Layout.
 * @api
 */
ol.geom.LineString = function(coordinates, opt_layout) {

  ol.geom.SimpleGeometry.call(this);

  /**
   * @private
   * @type {ol.Coordinate}
   */
  this.flatMidpoint_ = null;

  /**
   * @private
   * @type {number}
   */
  this.flatMidpointRevision_ = -1;

  /**
   * @private
   * @type {number}
   */
  this.maxDelta_ = -1;

  /**
   * @private
   * @type {number}
   */
  this.maxDeltaRevision_ = -1;

  this.setCoordinates(coordinates, opt_layout);

};
ol.inherits(ol.geom.LineString, ol.geom.SimpleGeometry);


/**
 * 附加的坐标传递给linestring的坐标。
 * @param {ol.Coordinate} coordinate Coordinate.
 * @api
 */
ol.geom.LineString.prototype.appendCoordinate = function(coordinate) {
  if (!this.flatCoordinates) {
    this.flatCoordinates = coordinate.slice();
  } else {
    ol.array.extend(this.flatCoordinates, coordinate);
  }
  this.changed();
};


/**
 * 做一个完整的几何的副本。
 * @return {!ol.geom.LineString} Clone.
 * @override
 * @api
 */
ol.geom.LineString.prototype.clone = function() {
  var lineString = new ol.geom.LineString(null);
  lineString.setFlatCoordinates(this.layout, this.flatCoordinates.slice());
  return lineString;
};


/**
 * @inheritDoc
 */
ol.geom.LineString.prototype.closestPointXY = function(x, y, closestPoint, minSquaredDistance) {
  if (minSquaredDistance <
      ol.extent.closestSquaredDistanceXY(this.getExtent(), x, y)) {
    return minSquaredDistance;
  }
  if (this.maxDeltaRevision_ != this.getRevision()) {
    this.maxDelta_ = Math.sqrt(ol.geom.flat.closest.getMaxSquaredDelta(
        this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, 0));
    this.maxDeltaRevision_ = this.getRevision();
  }
  return ol.geom.flat.closest.getClosestPoint(
      this.flatCoordinates, 0, this.flatCoordinates.length, this.stride,
      this.maxDelta_, false, x, y, closestPoint, minSquaredDistance);
};


/**
 * 遍历每一段,调用所提供的回调。
 * 如果回调返回一个真相的函数返回值
 * 立即值。否则,函数返回“false”。
 *
 * @param {function(this: S, ol.Coordinate, ol.Coordinate): T} callback Function
 *     called for each segment.
 * @param {S=} opt_this The object to be used as the value of 'this'
 *     within callback.
 * @return {T|boolean} Value.
 * @template T,S
 * @api
 */
ol.geom.LineString.prototype.forEachSegment = function(callback, opt_this) {
  return ol.geom.flat.segments.forEach(this.flatCoordinates, 0,
      this.flatCoordinates.length, this.stride, callback, opt_this);
};


/**
 * 返回协调使用线性插值在“m”,或“零”如果没有
 * 这种协调的存在。
 *
 * “opt_extrapolate”控制范围之外的外推的女士
 * MultiLineString。如果“opt_extrapolate”是“真正的”那Ms小于第一
 * 米将返回第一个坐标和大于最后一个ms
 * 返回最后一个坐标。
 *
 * @param {number} m M.
 * @param {boolean=} opt_extrapolate Extrapolate. Default is `false`.
 * @return {ol.Coordinate} Coordinate.
 * @api
 */
ol.geom.LineString.prototype.getCoordinateAtM = function(m, opt_extrapolate) {
  if (this.layout != ol.geom.GeometryLayout.XYM &&
      this.layout != ol.geom.GeometryLayout.XYZM) {
    return null;
  }
  var extrapolate = opt_extrapolate !== undefined ? opt_extrapolate : false;
  return ol.geom.flat.interpolate.lineStringCoordinateAtM(this.flatCoordinates, 0,
      this.flatCoordinates.length, this.stride, m, extrapolate);
};


/**
 * 返回linestring的坐标。
 * @return {Array.<ol.Coordinate>} Coordinates.
 * @override
 * @api
 */
ol.geom.LineString.prototype.getCoordinates = function() {
  return ol.geom.flat.inflate.coordinates(
      this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
};


/**
 * 返回的协调提供沿着linestring分数。
 * “分数”是在0和1之间的数字,0是开始的地方
 * linestring,1是结束。
 * @param {number} fraction Fraction.
 * @param {ol.Coordinate=} opt_dest Optional coordinate whose values will
 *     be modified. If not provided, a new coordinate will be returned.
 * @return {ol.Coordinate} Coordinate of the interpolated point.
 * @api
 */
ol.geom.LineString.prototype.getCoordinateAt = function(fraction, opt_dest) {
  return ol.geom.flat.interpolate.lineString(
      this.flatCoordinates, 0, this.flatCoordinates.length, this.stride,
      fraction, opt_dest);
};


/**
 *返回的长度linestring在投影平面上。
 * @return {number} Length (on projected plane).
 * @api
 */
ol.geom.LineString.prototype.getLength = function() {
  return ol.geom.flat.length.lineString(
      this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
};


/**
 * @return {Array.<number>} Flat midpoint.
 */
ol.geom.LineString.prototype.getFlatMidpoint = function() {
  if (this.flatMidpointRevision_ != this.getRevision()) {
    this.flatMidpoint_ = this.getCoordinateAt(0.5, this.flatMidpoint_);
    this.flatMidpointRevision_ = this.getRevision();
  }
  return this.flatMidpoint_;
};


/**
 * @inheritDoc
 */
ol.geom.LineString.prototype.getSimplifiedGeometryInternal = function(squaredTolerance) {
  var simplifiedFlatCoordinates = [];
  simplifiedFlatCoordinates.length = ol.geom.flat.simplify.douglasPeucker(
      this.flatCoordinates, 0, this.flatCoordinates.length, this.stride,
      squaredTolerance, simplifiedFlatCoordinates, 0);
  var simplifiedLineString = new ol.geom.LineString(null);
  simplifiedLineString.setFlatCoordinates(
      ol.geom.GeometryLayout.XY, simplifiedFlatCoordinates);
  return simplifiedLineString;
};


/**
 * @inheritDoc
 * @api
 */
ol.geom.LineString.prototype.getType = function() {
  return ol.geom.GeometryType.LINE_STRING;
};


/**
 * @inheritDoc
 * @api
 */
ol.geom.LineString.prototype.intersectsExtent = function(extent) {
  return ol.geom.flat.intersectsextent.lineString(
      this.flatCoordinates, 0, this.flatCoordinates.length, this.stride,
      extent);
};


/**
 * linestring的坐标。
 * @param {Array.<ol.Coordinate>} coordinates Coordinates.
 * @param {ol.geom.GeometryLayout=} opt_layout Layout.
 * @override
 * @api
 */
ol.geom.LineString.prototype.setCoordinates = function(coordinates, opt_layout) {
  if (!coordinates) {
    this.setFlatCoordinates(ol.geom.GeometryLayout.XY, null);
  } else {
    this.setLayout(opt_layout, coordinates, 1);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    this.flatCoordinates.length = ol.geom.flat.deflate.coordinates(
        this.flatCoordinates, 0, coordinates, this.stride);
    this.changed();
  }
};


/**
 * @param {ol.geom.GeometryLayout} layout Layout.
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 */
ol.geom.LineString.prototype.setFlatCoordinates = function(layout, flatCoordinates) {
  this.setFlatCoordinatesInternal(layout, flatCoordinates);
  this.changed();
};
