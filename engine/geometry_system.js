var Jabaku = (function(module) {
	function Geometry(material) {
		this.meshes = [];
		this.transforms = [];
		this.material = material;
	}

	function GeometrySystem(engine, transformSystem) {
		this._engine = engine;
		this._geometries = new Jabaku.IdContainer();
		this._transformSystem = transformSystem;
	}
	GeometrySystem.extends(Object, {
		setGeometry: function(id, material) {
			this._geometries.add(id, new Geometry(material));
		},
		addMesh: function(id, mesh, transform) {
			var geometry = this._geometries.get(id);
			geometry.meshes.push(mesh);
			geometry.transforms.push(transform);
  		},
		addQuad: function(id, transform) {
			this.addMesh(id, Jabaku.createQuadMesh(this._engine), transform);
		},
		addCube: function(id, transform) {
			this.addMesh(id, Jabaku.createCubeMesh(this._engine), transform);
		},
		remove: function(id) {
			this._geometries.remove(id);
		},
		getMaterial: function(id) {
			var geometry = this._geometries.get(id);
			return geometry.material;
		},
		run: function(entities, globalParams, view) {
			var geometryEntities = [];
			for (var i = 0; i < entities.length; ++i) {
				var entity = entities[i];

				if (this._geometries.get(entity) !== undefined) {
					geometryEntities.push({id: entity});
				}
			}

			FrameProfiler.start('SortByZ');
			for (var i = 0; i < geometryEntities.length; ++i) {
				var entity = geometryEntities[i];
				var transform = this._transformSystem.get(entity.id);
				if (transform !== undefined) {
					entity.viewZ = transform.pos.clone().transformMat4(view).z;
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
				var geometry = this._geometries.get(entity.id);

				var transform = this._transformSystem.get(entity.id);
				var worldMatrix = new Vecmath.Matrix4();
				if (transform !== undefined) {
					worldMatrix = transform.transform;
				}
				geometry.material.setParams(globalParams);
				var material = geometry.material;
				this._engine.setBlendMode(material.blendMode);
				this._engine.setProgram(material.program, globalParams);

				for (var meshIdx = 0; meshIdx < geometry.meshes.length; ++meshIdx) {
					var mesh = geometry.meshes[meshIdx];
					var trans = geometry.transforms[meshIdx];

					globalTrans = worldMatrix.clone();
					if (trans !== undefined) {
						globalTrans.mul(trans.transform);
					}

					var localParams = {};
					localParams.uWorld = globalTrans.val;
					localParams.uWorldIT = globalTrans.clone().invert().transpose().val;
					this._engine.setProgramParameters(localParams);
					mesh.render(this._engine);
				}
			}
		}		
	});

	module.GeometrySystem = GeometrySystem;
	return module;
})(Jabaku || {});
