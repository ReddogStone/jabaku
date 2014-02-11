var Jabaku = (function(module) {
	'use strict';

	function SceneSettings() {
	}
	SceneSettings.extends(Object, {
		get pointLight1() {
			return this._pointLight1;
		},
		set pointLight1(value) {
			this._pointLight1 = value ? value.clone() : value;
		},
		get pointLight2() {
			return this._pointLight2;
		},
		set pointLight2(value) {
			this._pointLight2 = value ? value.clone() : value;
		},
		setParams: function(viewport, camera, params) {
			FrameProfiler.start('GatherParams');
			FrameProfiler.start('GetCameraStuff');
			params.uView = camera.view.val;
			params.uProjection = camera.projection.val;
			params.uPosCamera = camera.pos.toArray();
			FrameProfiler.stop();

			params.uAmbient = new Float32Array([0.1, 0.1, 0.1]);
			if (this._pointLight1) {
				params.uPosLight1 = this._pointLight1.pos.toArray();
				params.uColorLight1 = this._pointLight1.color.toArray3();
			} else {
				params.uPosLight1 = [0, 0, 0];
				params.uColorLight1 = Color.black.toArray3();
			}

			if (this._pointLight2) {
				params.uPosLight2 = this._pointLight2.pos.toArray();
				params.uColorLight2 = this._pointLight2.color.toArray3();
			} else {
				params.uPosLight2 = [0, 0, 0];
				params.uColorLight2 = Color.black.toArray3();
			}
			FrameProfiler.stop();
		}
	});

	module.SceneSettings = SceneSettings;
	return module;
})(Jabaku || {});