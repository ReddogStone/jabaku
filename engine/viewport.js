var Viewport = (function() {
	'use strict';

	function make(x, y, sx, sy) {
		return {
			x: x || 0,
			y: y || 0,
			sx: sx || 0,
			sy: sy || 0
		};
	}

	return {
		make: make,
		clone: function(value) {
			return make(value.x, value.y, value.sx, value.sy); 
		},
		toVector4: function(value) {
			return new Vector4(value.x, value.y, value.sx, value.sy);
		}
	};
})();