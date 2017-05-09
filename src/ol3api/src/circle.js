goog.provide('ol.geom.Circle');

goog.require('ol');
goog.require('ol.extent');
goog.require('ol.geom.GeometryLayout');
goog.require('ol.geom.GeometryType');
goog.require('ol.geom.SimpleGeometry');
goog.require('ol.geom.flat.deflate');


/**
 * @classdesc
 * Circle 图形.
 *
 * @constructor
 * @extends {ol.geom.SimpleGeometry}
 * @param {ol.Coordinate} center Center.
 * @param {number=} opt_radius Radius.
 * @param {ol.geom.GeometryLayout=} opt_layout Layout.
 * @api
 */
ol.geom.Circle = function(center, opt_radius, opt_layout) {
  ol.geom.SimpleGeometry.call(this);
  var radius = opt_radius ? opt_radius : 0;
  this.setCenterAndRadius(center, radius, opt_layout);
};
ol.inherits(ol.geom.Circle, ol.geom.SimpleGeometry);


/**
 * 做一个完整的几何的副本。
 * @return {!ol.geom.Circle} Clone.
 * @override
 * @api
 */
ol.geom.Circle.prototype.clone = function() {
  var circle = new ol.geom.Circle(null);
  circle.setFlatCoordinates(this.layout, this.flatCoordinates.slice());
  return circle;
};


/**
 * @inheritDoc
 */
ol.geom.Circle.prototype.closestPointXY = function(x, y, closestPoint, minSquaredDistance) {
  var flatCoordinates = this.flatCoordinates;
  var dx = x - flatCoordinates[0];
  var dy = y - flatCoordinates[1];
  var squaredDistance = dx * dx + dy * dy;
  if (squaredDistance < minSquaredDistance) {
    var i;
    if (squaredDistance === 0) {
      for (i = 0; i < this.stride; ++i) {
        closestPoint[i] = flatCoordinates[i];
      }
    } else {
      var delta = this.getRadius() / Math.sqrt(squaredDistance);
      closestPoint[0] = flatCoordinates[0] + delta * dx;
      closestPoint[1] = flatCoordinates[1] + delta * dy;
      for (i = 2; i < this.stride; ++i) {
        closestPoint[i] = flatCoordinates[i];
      }
    }
    closestPoint.length = this.stride;
    return squaredDistance;
  } else {
    return minSquaredDistance;
  }
};


/**
 * @inheritDoc
 */
ol.geom.Circle.prototype.containsXY = function(x, y) {
  var flatCoordinates = this.flatCoordinates;
  var dx = x - flatCoordinates[0];
  var dy = y - flatCoordinates[1];
  return dx * dx + dy * dy <= this.getRadiusSquared_();
};


/**
 * Return the center of the circle as {@link ol.Coordinate coordinate}.
 * @return {ol.Coordinate} Center.
 * @api
 */
ol.geom.Circle.prototype.getCenter = function() {
  return this.flatCoordinates.slice(0, this.stride);
};


/**
 * @inheritDoc
 */
ol.geom.Circle.prototype.computeExtent = function(extent) {
  var flatCoordinates = this.flatCoordinates;
  var radius = flatCoordinates[this.stride] - flatCoordinates[0];
  return ol.extent.createOrUpdate(
      flatCoordinates[0] - radius, flatCoordinates[1] - radius,
      flatCoordinates[0] + radius, flatCoordinates[1] + radius,
      extent);
};


/**
 * 圆的半径。
 * @return {number} Radius.
 * @api
 */
ol.geom.Circle.prototype.getRadius = function() {
  return Math.sqrt(this.getRadiusSquared_());
};


/**
 * @private
 * @return {number} Radius squared.
 */
ol.geom.Circle.prototype.getRadiusSquared_ = function() {
  var dx = this.flatCoordinates[this.stride] - this.flatCoordinates[0];
  var dy = this.flatCoordinates[this.stride + 1] - this.flatCoordinates[1];
  return dx * dx + dy * dy;
};


/**
 * @inheritDoc
 * @api
 */
ol.geom.Circle.prototype.getType = function() {
  return ol.geom.GeometryType.CIRCLE;
};


/**
 * @inheritDoc
 * @api
 */
ol.geom.Circle.prototype.intersectsExtent = function(extent) {
  var circleExtent = this.getExtent();
  if (ol.extent.intersects(extent, circleExtent)) {
    var center = this.getCenter();

    if (extent[0] <= center[0] && extent[2] >= center[0]) {
      return true;
    }
    if (extent[1] <= center[1] && extent[3] >= center[1]) {
      return true;
    }

    return ol.extent.forEachCorner(extent, this.intersectsCoordinate, this);
  }
  return false;

};


/**
 * Set the center of the circle as {@link ol.Coordinate coordinate}.
 * @param {ol.Coordinate} center Center.
 * @api
 */
ol.geom.Circle.prototype.setCenter = function(center) {
  var stride = this.stride;
  var radius = this.flatCoordinates[stride] - this.flatCoordinates[0];
  var flatCoordinates = center.slice();
  flatCoordinates[stride] = flatCoordinates[0] + radius;
  var i;
  for (i = 1; i < stride; ++i) {
    flatCoordinates[stride + i] = center[i];
  }
  this.setFlatCoordinates(this.layout, flatCoordinates);
};


/**
 * Set the center (as {@link ol.Coordinate coordinate}) and the radius (as
 * number) of the circle.
 * @param {ol.Coordinate} center Center.
 * @param {number} radius Radius.
 * @param {ol.geom.GeometryLayout=} opt_layout Layout.
 * @api
 */
ol.geom.Circle.prototype.setCenterAndRadius = function(center, radius, opt_layout) {
  if (!center) {
    this.setFlatCoordinates(ol.geom.GeometryLayout.XY, null);
  } else {
    this.setLayout(opt_layout, center, 0);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    /** @type {Array.<number>} */
    var flatCoordinates = this.flatCoordinates;
    var offset = ol.geom.flat.deflate.coordinate(
        flatCoordinates, 0, center, this.stride);
    flatCoordinates[offset++] = flatCoordinates[0] + radius;
    var i, ii;
    for (i = 1, ii = this.stride; i < ii; ++i) {
      flatCoordinates[offset++] = flatCoordinates[i];
    }
    flatCoordinates.length = offset;
    this.changed();
  }
};


/**
 * @inheritDoc
 */
ol.geom.Circle.prototype.getCoordinates = function() {};


/**
 * @inheritDoc
 */
ol.geom.Circle.prototype.setCoordinates = function(coordinates, opt_layout) {};


/**
 * @param {ol.geom.GeometryLayout} layout Layout.
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 */
ol.geom.Circle.prototype.setFlatCoordinates = function(layout, flatCoordinates) {
  this.setFlatCoordinatesInternal(layout, flatCoordinates);
  this.changed();
};


/**
 * 圆的半径。半径是单位的投影。
 * @param {number} radius Radius.
 * @api
 */
ol.geom.Circle.prototype.setRadius = function(radius) {
  this.flatCoordinates[this.stride] = this.flatCoordinates[0] + radius;
  this.changed();
};

