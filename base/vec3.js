function Vec3(x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
  return this;
};

Vec3.prototype.add = function(v) {
  this.x += v.x;
  this.y += v.y;
  this.z += v.z;
  return this;
};

Vec3.prototype.clone = function() {
  return new Vec3(this.x, this.y, this.z);
};

Vec3.prototype.subtract = function(v) {
  this.x -= v.x;
  this.y -= v.y;
  this.z -= v.z;
  return this;
};

Vec3.prototype.scale = function(s) {
  this.x = this.x * s;
  this.y = this.y * s;
  this.z = this.z * s;
  return this;
};

Vec3.prototype.normalize = function() {
  var length = this.length();
  this.x = this.x / length;
  this.y = this.y / length;
  this.z = this.z / length;
  return this;
};

Vec3.prototype.length = function() {
  return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};

Vec3.prototype.truncate = function(max) {
  var length = this.length();
  if (length > max) {
    this.x = this.x * max / length;
    this.y = this.y * max / length;
    this.z = this.z * max / length;
  }
  return this;
};

Vec3.prototype.dot = function(v) {
  return this.x * v.x + this.y * v.y + this.z * v.z;
};

export default Vec3;
