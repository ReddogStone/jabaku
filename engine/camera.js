var Jabaku = (function(module) {
	'use strict';

	function Camera(projection, view, target) {
		this.projection = projection || new Matrix4();
		this.view = view || new Matrix4();
		this.target = target;
		this.pos = new Vector3();
	}
	Camera.extends(Object, {
		makePerspective: function(fov, aspect, nearPlane, farPlane) {
			this.projection = new Matrix4().perspective(fov, aspect, nearPlane, farPlane);
		}
	});

	module.Camera = Camera;
	return module;
})(Jabaku || {});