var Jabaku = (function(module) {
	'use strict';

	var RendererUtils = {
		setCameraParameters: function(camera, params) {
			params.uView = camera.view.val;
			params.uProjection = camera.projection.val;
			params.uPosCamera = camera.pos.toArray();
		},
		setViewport: function(engine, viewport, params) {
			if (!viewport) {
				var size = engine.getDrawingBufferSize();
				viewport = new Jabaku.Viewport(0, 0, size.x, size.y);
			}

			engine.setViewport(viewport)
			params.uScreenSize = [viewport.sx, viewport.sy];
		},
		setForwardLightParameters: function(lightSettings, params) {
			params.uAmbient = lightSettings.ambientColor.toArray3();
			if (lightSettings.pointLight1) {
				params.uPosLight1 = lightSettings.pointLight1.pos.toArray();
				params.uColorLight1 = lightSettings.pointLight1.color.toArray3();
			} else {
				params.uPosLight1 = [0, 0, 0];
				params.uColorLight1 = Color.black.toArray3();
			}

			if (lightSettings.pointLight2) {
				params.uPosLight2 = lightSettings.pointLight2.pos.toArray();
				params.uColorLight2 = lightSettings.pointLight2.color.toArray3();
			} else {
				params.uPosLight2 = [0, 0, 0];
				params.uColorLight2 = Color.black.toArray3();
			}
		}
	}

	module.RendererUtils = RendererUtils;
	return module;
})(Jabaku || {});
