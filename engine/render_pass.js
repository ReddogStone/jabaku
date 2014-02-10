var Jabaku = (function(module) {
	'use strict';

	function renderPass(engine, camera, lightSettings, objects, frameBuffer, viewport, materialOverride, params) {
		if (!viewport) {
			var size = engine.getDrawingBufferSize();
			viewport = new Jabaku.Viewport(0, 0, size.x, size.y);
		}

		params = params || {};

		engine.setViewport(viewport)

		if (frameBuffer) {
			engine.setFrameBuffer(frameBuffer);
		} else {
			engine.setDefaultFrameBuffer();
		}

		params.uScreenSize = [viewport.sx, viewport.sy];

		params.uView = camera.view.val;
		params.uProjection = camera.projection.val;
		params.uPosCamera = camera.pos.toArray();

		lightSettings.setParams(params);

		for (var i = 0; i < objects.length; ++i) {
			var object = objects[i];
			object.prepare(engine);
			object.setParams(params);

			var material = materialOverride || object.material;
			engine.setBlendMode(material.blendMode);
			engine.setProgram(material.program, params);
			object.render(engine);
		}
	}

	module.renderPass = renderPass;
	return module;
})(Jabaku || {});
