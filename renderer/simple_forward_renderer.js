var Jabaku = (function(module) {
	'use strict';

	function SimpleForwardRenderer(engine, backgroundColor) {
		this._engine = engine;
		this._backgroundColor = backgroundColor;
	}
	SimpleForwardRenderer.extends(Object, {
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
		render: function(objects, transforms, camera, lightSettings, frameBuffer, viewport) {
			this._prepareFrameBuffer(frameBuffer);

			var engine = this._engine;
			var utils = Jabaku.RendererUtils;
			var params = {};
			utils.setViewport(engine, viewport, params);
			utils.setCameraParameters(camera, params);
			utils.setForwardLightParameters(lightSettings, params);

			for (var i = 0; i < objects.length; ++i) {
				var transform = transforms[i];
				var globalTrans = transform.global;
				params.uWorld = globalTrans.val;
				params.uWorldIT = globalTrans.clone().invert().transpose().val;

				var object = objects[i];
				object.prepare(engine);
				object.setParams(params);

				var material = object.material;
				engine.setBlendMode(material.blendMode);
				engine.setProgram(material.program, params);
				object.render(engine);
			}
		}
	});

	module.SimpleForwardRenderer = SimpleForwardRenderer;
	return module;
})(Jabaku || {});
