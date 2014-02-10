var Jabaku = (function(module) {
	'use strict';

	function QuadBatch(engine, textureId) {
		var mesh = Jabaku.createQuadData();

		var instanceDataDesc = {
			"aWorldX": { "components": 4, "type": "FLOAT", "normalized": false },
			"aWorldY": { "components": 4, "type": "FLOAT", "normalized": false },
			"aWorldZ": { "components": 4, "type": "FLOAT", "normalized": false },
			"aWorldW": { "components": 4, "type": "FLOAT", "normalized": false },
			"aColor": { "components": 4, "type": "FLOAT", "normalized": false },
			"aIndexLum": { "components": 2, "type": "FLOAT", "normalized": false }
		};
		
		this._batch = new Jabaku.RenderBatch(engine, mesh, instanceDataDesc);
		var texture;
		if (textureId !== undefined) {
			texture = engine.getTexture(textureId);
		}
		this.material = new SimpleInstMaterial(engine, texture);
	}
	QuadBatch.extends(Object, {
		add: function(transform, color, atlasIndex, luminosity) {
			var data = transform.toArray().concat(color.toArray4()).concat([atlasIndex, luminosity]);
			return this._batch.addSingleInstance(data);
		},
		remove: function(id) {
			this._batch.removeSingleInstance(id);
		},
		get: function(id) {
			var data = this._batch.getSingleInstance(id);
			return {
				transform: new Vecmath.Matrix4().fromArray(data),
				color: new Color(data[16], data[17], data[18], data[19]),
				atlasIndex: data[20],
				luminosity: data[21]
			};
		},
		set: function(id, transform, color, atlasIndex, luminosity) {
			var data = transform.toArray().concat(color.toArray4()).concat([atlasIndex, luminosity]);
			this._batch.setSingleInstance(id, data);
		},
		setTransform: function(id, value) {
			this._batch.setComponent(
				id, function(data) {
					var val = value.val;
					data[0] = val[0];
					data[1] = val[1];
					data[2] = val[2];
					data[3] = val[3];
					data[4] = val[4];
					data[5] = val[5];
					data[6] = val[6];
					data[7] = val[7];
					data[8] = val[8];
					data[9] = val[9];
					data[10] = val[10];
					data[11] = val[11];
					data[12] = val[12];
					data[13] = val[13];
					data[14] = val[14];
					data[15] = val[15];
				});
		},
		setColor: function(id, value) {
			this._batch.setComponent(id, function(data) { 
				data[16] = value.red; data[17] = value.green; data[18] = value.blue; data[19] = value.alpha;
			});
		},
		setAtlasIndex: function(id, value) {
			this._batch.setComponent(id, function(data) { data[20] = value; });
		},
		setLuminosity: function(id, value) {
			this._batch.setComponent(id, function(data) { data[21] = value; });
		},

		// Renderable interface
		prepare: function(engine) {
			this._batch.prepare(engine);
		},
		setParams: function(globalParams) {
			this.material.setParams(globalParams);
		},
		render: function(engine) {
			this._batch.render(engine);
		}
	});

	module.QuadBatch = QuadBatch;
	return module;
})(Jabaku || {});
