var Jabaku = (function(module) {
	'use strict';

	function Viewport(x, y, sx, sy) {
		this.x = x || 0;
		this.y = y || 0;
		
		if (sx) {
			this.sx = sx;
			this.sy = sy;
		} else {
			var canvas = document.getElementById('canvas');
			this.sx = canvas.width;
			this.sy = canvas.height;
		}
	}
	Viewport.extends(Object, {
		toVector4: function() {
			return new Vecmath.Vector4(this.x, this.y, this.sx, this.sy);
		}
	});
	Viewport.clone = function(value) {
		return new Viewport(value.x, value.y, value.sx, value.sy);
	};

	module.Viewport = Viewport;
	return module;
})(Jabaku || {});