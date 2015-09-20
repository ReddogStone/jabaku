var Jabaku = (function(module) {
	'use strict';

	function PointLight(pos, color) {
		this.pos = pos ? pos.clone() : new Vector3();
		this.color = Color.clone(color);
	}
	PointLight.extends(Object, {
		clone: function() {
			return new PointLight(this.pos, this.color);
		}
	});

	module.PointLight = PointLight;
	return module;
})(Jabaku || {});