var Jabaku = (function(module) {
	'use strict';

	function QuadRenderable(engine, material) {
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
		this.material = material;
	}
	QuadRenderable.extends(Object, {
		prepare: function(engine) {
		},
		setParams: function(globalParams) {
			this.material.setParams(globalParams);
		},
		render: function(engine) {
			this._mesh.render(engine);
		}
	});

	module.QuadRenderable = QuadRenderable;
	return module;
})(Jabaku || {});