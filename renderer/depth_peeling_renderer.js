var Jabaku = (function(module) {
	'use strict';

	function DepthPeelingRenderer(engine, backgroundColor) {
		this._engine = engine;
		this._backgroundColor = backgroundColor;

		this.debugRender = false;

		var size = engine.getDrawingBufferSize();
		this._rt1 = engine.createRenderTexture('depthPeelingRT1', size);
		this._rt2 = engine.createRenderTexture('depthPeelingRT2', size);
		this._rt3 = engine.createRenderTexture('depthPeelingRT3', size);
		this._rt4 = engine.createRenderTexture('depthPeelingRT4', size);

		this._dt1 = engine.createDepthTexture('depthPeelingDT1', size);
		this._dt2 = engine.createDepthTexture('depthPeelingDT2', size);
		this._dt3 = engine.createDepthTexture('depthPeelingDT3', size);

		this._fb1 = engine.createFrameBuffer('depthPeelingFB1', this._rt1, this._dt1);
		this._fb2 = engine.createFrameBuffer('depthPeelingFB2', this._rt2, this._dt2);
		this._fb3 = engine.createFrameBuffer('depthPeelingFB3', this._rt3, this._dt3);
		this._fb4 = engine.createFrameBuffer('depthPeelingFB4', this._rt4, this._dt1);

		this._finalCombineProgram = Engine3D.createProgram('dp_final_combine',
			FileUtils.loadFile('jabaku/shaders/pass_through.vshader'),
			FileUtils.loadFile('jabaku/shaders/dp_final_combine.fshader'));
	}
	DepthPeelingRenderer.extends(Object, {
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
		_renderObjects: function(objects, params, blendMode) {
			var engine = this._engine;

			for (var i = 0; i < objects.length; ++i) {
				var object = objects[i];
				object.prepare(engine);
				object.setParams(params);

				var material = object.material;
				engine.setBlendMode(blendMode);
				engine.setProgram(material.programs.depthPeeling, params);
				object.render(engine);
			}
		},
		_clearFB: function(frameBuffer, depthValue) {
			var engine = this._engine;
			engine.setFrameBuffer(frameBuffer);
			engine.setClearDepth(depthValue);
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

			engine.setBlendMode(BlendMode.NONE);
			this._clearFB('depthPeelingFB1', 1.0);
			this._clearFB('depthPeelingFB2', 0.0);

			engine.setFrameBuffer('depthPeelingFB1');
			params.uDepthTexture = {texture: this._dt2, sampler: 1};
			this._renderObjects(objects, params, BlendMode.SOLID);

			this._clearFB('depthPeelingFB2', 1.0);
			engine.setFrameBuffer('depthPeelingFB2');
			params.uDepthTexture = {texture: this._dt1, sampler: 1};
			this._renderObjects(objects, params, BlendMode.SOLID);

			this._clearFB('depthPeelingFB3', 1.0);
			engine.setFrameBuffer('depthPeelingFB3');
			params.uDepthTexture = {texture: this._dt2, sampler: 1};
			this._renderObjects(objects, params, BlendMode.SOLID);

			this._clearFB('depthPeelingFB4', 1.0);
			engine.setFrameBuffer('depthPeelingFB4');
			params.uDepthTexture = {texture: this._dt3, sampler: 1};
			this._renderObjects(objects, params, BlendMode.SOLID);

			if (frameBuffer) {
				engine.setFrameBuffer(frameBuffer);
			} else {
				engine.setDefaultFrameBuffer();
			}
			engine.setBlendMode(BlendMode.NONE);
			engine.setProgram(this._finalCombineProgram, {
				uTexture1: {texture: this._rt1, sampler: 0},
				uTexture2: {texture: this._rt2, sampler: 1},
				uTexture3: {texture: this._rt3, sampler: 2},
				uTexture4: {texture: this._rt4, sampler: 3}
			});
			utils.setViewport(engine, viewport, params);
			engine.renderScreenQuad();

			if (this.debugRender) {
				engine.renderDepthTexture(this._dt1, 0, 0, 200, 200);
				engine.renderDepthTexture(this._dt2, 200, 0, 200, 200);
				engine.renderDepthTexture(this._dt3, 400, 0, 200, 200);

				engine.renderDebugQuad(this._rt1, 0, 568, 200, 200);
				engine.renderDebugQuad(this._rt2, 200, 568, 200, 200);
				engine.renderDebugQuad(this._rt3, 400, 568, 200, 200);
				engine.renderDebugQuad(this._rt4, 600, 568, 200, 200);
			}
		}
	});

	module.DepthPeelingRenderer = DepthPeelingRenderer;
	return module;
})(Jabaku || {});
