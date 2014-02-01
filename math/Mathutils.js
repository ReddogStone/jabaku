var Vecmath = (function(module) {
	'use strict';

	function expAttVec(value, target, deltaTime, halfTime) {
		var amount = 1.0 - Math.pow(0.5, deltaTime / halfTime);
		value.lerp(target, amount);
	}
	
	module.expAttVec = expAttVec;
	
	return module;
}) (Vecmath || {});