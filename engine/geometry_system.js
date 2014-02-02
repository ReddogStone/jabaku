var Jabaku = (function(module) {
	function Geometry(mesh, material) {
		this._mesh = mesh;
		this._material = material;
	}
	Geometry.extends(Object, {
		get material() {
			return this._material;
		},
		setParams: function(globalParams) {
			this._material.setParams(globalParams);
		},
		render: function(engine) {
			this._mesh.render(engine);
		}
	});

	function GeometrySystem(engine) {
		this._engine = engine;
		this._meshes = new Jabaku.IdContainer();
	}
	GeometrySystem.extends(Object, {
		addMesh: function(mesh, material) {
			return this._meshes.add(new Geometry(mesh, material));
		},
		addQuad: function(material) {
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
						"aPosition": { "components": 3, "type": "FLOAT", "normalized": false },
						"aNormal": { "components": 3, "type": "FLOAT", "normalized": false },
						"aTexCoord": { "components": 2, "type": "FLOAT", "normalized": false }
					}
				}
			];
			return this._meshes.add(new Geometry(Mesh.loadFromJson(this._engine, meshData), material));
		},
		remove: function(id) {
			this._meshes.remove(id);
		},
		getMaterial: function(id) {
			var geometry = this._meshes.get(id);
			return geometry.material;
		},
		run: function(entities, globalParams) {
			for (var i = 0; i < entities.length; ++i) {
				var entity = entities[i];

				if ((entity.geometry !== undefined) && !entity.invisible) {
					var geometry = this._meshes.get(entity.geometry);

					if (entity.transformable) {
						var worldMatrix = entity.transformable.transform;
						globalParams.uWorld = worldMatrix.val;
						globalParams.uWorldIT = worldMatrix.clone().invert().transpose().val
					}
					geometry.setParams(globalParams);
					var material = geometry.material;
					this._engine.setBlendMode(material.blendMode);
					this._engine.setProgram(material.program, globalParams);

					geometry.render(this._engine);
				}
			}
		}		
	});

	module.GeometrySystem = GeometrySystem;
	return module;
})(Jabaku || {});
