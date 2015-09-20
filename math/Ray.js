var Ray = (function() {
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
	
	return Ray;
})();