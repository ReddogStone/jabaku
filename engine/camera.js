var Jabaku = (function(module) {
	'use strict';

	function Camera(projection, view, target) {
		this.projection = projection || new Vecmath.Matrix4();
		this.view = view || new Vecmath.Matrix4();
		this.target = target;
		this.pos = new Vecmath.Vector3();
	}
	Camera.extends(Object, {
		makePerspective: function(fov, aspect, nearPlane, farPlane) {
			this.projection = new Vecmath.Matrix4().perspective(fov, aspect, nearPlane, farPlane);
		}
	});

	module.Camera = Camera;
	return module;
})(Jabaku || {});