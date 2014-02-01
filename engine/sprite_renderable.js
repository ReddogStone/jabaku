'use strict';

function SpriteRenderable(engine, textureId) {
	var meshData = [
		{
			"vertices": [
				//x	   y	z	 nx   ny   nz   tu   tv
				-0.5,  0.5, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0,
				 0.5,  0.5, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0,
				-0.5, -0.5, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0,
				 0.5, -0.5, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0],
			"indices": [0, 1, 2, 2, 1, 3],
			"description": {
				"aPosition": { "components": 3, "type": "FLOAT", "normalized": false, "stride": 8 * 4, "offset": 0 },
				"aNormal": { "components": 3, "type": "FLOAT", "normalized": false, "stride": 8 * 4, "offset": 3 * 4 },
				"aTexCoord": { "components": 2, "type": "FLOAT", "normalized": false, "stride": 8 * 4, "offset": 6 * 4 }
			}
		}
	];
	
	this._mesh = Mesh.loadFromJson(engine, meshData);
	this.material = new SimpleMaterial(engine, engine.getTexture(textureId));
}
SpriteRenderable.extends(Object, {
	prepare: function(engine) {
	},
	setParams: function(globalParams) {
		this.material.setParams(globalParams);
	},
	render: function(engine) {
		this._mesh.render(engine);
	}
});

function PointSpriteRenderable(engine, textureId) {
	var meshData = [
		{
			"vertices": [
				//x	   y	z	 tu   tv
				-0.5,  0.5, 0.0, 0.0, 0.0,
				 0.5,  0.5, 0.0, 1.0, 0.0,
				-0.5, -0.5, 0.0, 0.0, 1.0,
				 0.5, -0.5, 0.0, 1.0, 1.0],
			"indices": [0, 1, 2, 2, 1, 3],
			"description": {
				"aPosition": { "components": 3, "type": "FLOAT", "normalized": false, "stride": 5 * 4, "offset": 0 },
				"aTexCoord": { "components": 2, "type": "FLOAT", "normalized": false, "stride": 5 * 4, "offset": 3 * 4 }
			}
		}
	];
	
	this._mesh = Mesh.loadFromJson(engine, meshData);
	this.material = new PointSpriteMaterial(engine, engine.getTexture(textureId));
}
PointSpriteRenderable.extends(Object, {
	prepare: function(engine) {
	},
	setParams: function(globalParams) {
		this.material.setParams(globalParams);
	},
	render: function(engine) {
		FrameProfiler.start('PointSpriteRender');
		this._mesh.render(engine);
		FrameProfiler.stop();
	}
});

function LineRenderable(engine, textureId, endPoint1, endPoint2) {
	this._endPoint1 = endPoint1;
	this._endPoint2 = endPoint2;
	var meshData = [
		{
			"vertices": [
				//x	 y	  tu   tv
				0.0, -1.0, 0.0, 0.0,
				1.0, -1.0, 1.0, 0.0,
				0.0,  1.0, 0.0, 1.0,
				1.0,  1.0, 1.0, 1.0],
			"indices": [0, 1, 2, 2, 1, 3],
			"description": {
				"aPosition": { "components": 2, "type": "FLOAT", "normalized": false, "stride": 4 * 4, "offset": 0 },
				"aTexCoord": { "components": 2, "type": "FLOAT", "normalized": false, "stride": 4 * 4, "offset": 2 * 4 }
			}
		}
	];
	
	this._mesh = Mesh.loadFromJson(engine, meshData);
	this.material = new LineMaterial(engine, engine.getTexture(textureId));
}
LineRenderable.extends(Object, {
	get endPoint1() {
		return this._endPoint1;
	},
	set endPoint1(value) {
		this._endPoint1 = value;
	},
	get endPoint2() {
		return this._endPoint2;
	},
	set endPoint2(value) {
		this._endPoint2 = value;
	},
	prepare: function(engine) {
	},
	setParams: function(globalParams) {
		globalParams.uEndPoint1 = this._endPoint1.pos.toArray();
		globalParams.uEndPoint2 = this._endPoint2.pos.toArray();
		this.material.setParams(globalParams);
	},
	render: function(engine) {
		FrameProfiler.start('LineRender');
		this._mesh.render(engine);
		FrameProfiler.stop();
	}
});
