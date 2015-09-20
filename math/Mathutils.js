var Vecmath = (function() {
	'use strict';

	function expAttVec(value, target, deltaTime, halfTime) {
		var amount = 1.0 - Math.pow(0.5, deltaTime / halfTime);
		value.lerp(target, amount);
	}
	
	function distPointRay(point, ray) {
		var baseToPoint = point.clone().sub(ray.from);
		var lenSq = baseToPoint.lenSq();
		var dot = baseToPoint.dot(ray.dir());
		return Math.sqrt(lenSq - dot * dot);
	}

	return {
		expAttVec: expAttVec,
		distPointRay: distPointRay
	};
}) ();