var Jabaku = (function(module) {
	'use strict';

	function WireframeRenderer(engine, backgroundColor) {
		this._engine = engine;
		this._backgroundColor = backgroundColor;
	}
	WireframeRenderer.extends(Object, {
		_prepareFrameBuffer: function(frameBuffer) {
			var engine = this._engine;
			if (frameBuffer) {
				engine.setFrameBuffer(frameBuffer);
			} else {
				engine.setDefaultFrameBuffer();
			}
			engine.setClearColor(this._backgroundColor);
			engine.clear();
		},
		render: function(objects, camera, lightSettings, frameBuffer, viewport) {
			this._prepareFrameBuffer(frameBuffer);

			var engine = this._engine;
			var utils = Jabaku.RendererUtils;
			var params = {};
			utils.setViewport(engine, viewport, params);
			utils.setCameraParameters(camera, params);
			utils.setForwardLightParameters(lightSettings, params);

			engine.setBlendMode(BlendMode.PREMUL_ALPHA);

			for (var i = 0; i < objects.length; ++i) {
				var object = objects[i];
				object.prepare(engine);
				object.setParams(params);

				var material = object.material;
				engine.setProgram(material.programs.wireframe, params);
				object.render(engine);
			}
		}
	});

	module.WireframeRenderer = WireframeRenderer;
	return module;
})(Jabaku || {});
