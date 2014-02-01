var Vecmath = (function(module) {
	'use strict';

	function Ray(from, to) {
		this.from = from.clone();
		this.to = to.clone();
	}

	var ray = Ray.prototype;

	ray.clone = function() {
		return new Ray(this.from, this.to);
	};

    ray.copy = function(value) {
		this.from = value.from.clone();
		this.to = value.to.clone();
		return this;
    };

    ray.set = function(from, to) {
		this.from = from.clone();
		this.to = to.clone();
        return this;
    };
	
	ray.direction = function() {
		return this.to.clone().sub(this.from).normalize();
	};
	
	ray.dir = ray.direction;
	
	function distPointRay(point, ray) {
		var baseToPoint = point.clone().sub(ray.from);
		var lenSq = baseToPoint.lenSq();
		var dot = baseToPoint.dot(ray.dir());
		return Math.sqrt(lenSq - dot * dot);
	}	

	module.Ray = Ray;
	module.distPointRay = distPointRay;

	return module;
}) (Vecmath || {});