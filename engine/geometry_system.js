var Jabaku = (function(module) {
	function Geometry(mesh, material) {
		this.mesh = mesh;
		this.material = material;
	}

	function GeometrySystem(engine) {
		this._engine = engine;
		this._meshes = new Jabaku.IdContainer();
	}
	GeometrySystem.extends(Object, {
		addMesh: function(mesh, material) {
			return this._meshes.add(new Geometry(mesh, material));
		},
		addQuad: function(material) {
			return this._meshes.add(new Geometry(Jabaku.createQuadMesh(this._engine), material));
		},
		addCube: function(material) {
			return this._meshes.add(new Geometry(Jabaku.createCubeMesh(this._engine), material));
		},
		remove: function(id) {
			this._meshes.remove(id);
		},
		getMaterial: function(id) {
			var geometry = this._meshes.get(id);
			return geometry.material;
		},
		run: function(entities, globalParams, view) {
			var geometryEntities = [];
			for (var i = 0; i < entities.length; ++i) {
				var entity = entities[i];

				if ((entity.geometry !== undefined) && !entity.invisible) {
					geometryEntities.push(entity);
				}
			}

			FrameProfiler.start('SortByZ');
			var entityCount = entities.length;
			for (var i = 0; i < geometryEntities.length; ++i) {
				var entity = geometryEntities[i];
				if (entity.transformable) {
					entity.viewZ = entity.transformable.pos.clone().transformMat4(view).z;
				} else {
					entity.viewZ = 0.0;
				}
			}
			
			geometryEntities.sort(function(e1, e2) {
				return e1.viewZ - e2.viewZ;
			});
			FrameProfiler.stop();

			for (var i = 0; i < geometryEntities.length; ++i) {
				var entity = geometryEntities[i];
				var geometry = this._meshes.get(entity.geometry);

				if (entity.transformable) {
					var worldMatrix = entity.transformable.transform;
					globalParams.uWorld = worldMatrix.val;
					globalParams.uWorldIT = worldMatrix.clone().invert().transpose().val
				}
				geometry.material.setParams(globalParams);
				var material = geometry.material;
				this._engine.setBlendMode(material.blendMode);
				this._engine.setProgram(material.program, globalParams);

				geometry.mesh.render(this._engine);				
			}
		}		
	});

	module.GeometrySystem = GeometrySystem;
	return module;
})(Jabaku || {});
