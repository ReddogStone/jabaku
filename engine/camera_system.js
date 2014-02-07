var Jabaku = (function(module) {
	function Camera(projection) {
		this.projection = projection;
		this.view = new Vecmath.Matrix4();
		this.target = null;
	}

	function CameraSystem(transformSystem) {
		this._cameras = new Jabaku.IdContainer();
		this._transformSystem = transformSystem;
	}
	CameraSystem.extends(Object, {
		addPerspective: function(id, fov, aspect, nearPlane, farPlane) {
			var projection = new Vecmath.Matrix4().perspective(fov, aspect, nearPlane, farPlane);
			return this._cameras.add(id, new Camera(projection));
		},
		get: function(id) {
			return this._cameras.get(id);
		},
		remove: function(id) {
			this._cameras.remove(id);
		},
		getTarget: function(id) {
			return this._cameras.get(id).target;
		},
		setTarget: function(id, value) {
			this._cameras.get(id).target = value ? value.clone() : value;
		},
		run: function(entities) {
			for (var i = 0; i < entities.length; ++i) {
				var entity = entities[i];
				var camera = this._cameras.get(entity);
				var trans = this._transformSystem.get(entity);
				if ((camera !== undefined) && (trans !== undefined)) {
					var view = camera.view;
					if (camera.target) {
						view.lookAt(trans.pos, camera.target, trans.up);
					} else {
						view.fromRotationTranslation(trans.rot, trans.pos).invert();
					}
				}
			}
		}
	});

	module.CameraSystem = CameraSystem;
	return module;
})(Jabaku || {});
