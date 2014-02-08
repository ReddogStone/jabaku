var Jabaku = (function(module) {
	'use strict';
	
	function Geometry(material) {
		this.material = material;

		this.meshes = [];
		this.transforms = [];

		this.quadIds = [];
		this.quadTransforms = [];
	}

	function GeometrySystem(engine, transformSystem) {
		this._engine = engine;
		this._geometries = new Jabaku.IdContainer();
		this._transformSystem = transformSystem;

		this._quadBatch = new Jabaku.QuadBatch(engine);
		this._quadBatch.material.blendMode = BlendMode.PREMUL_ALPHA;
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
			var geometry = this._geometries.get(id);
			var material = geometry.material;
			var trans = transform ? transform.transform : new Vecmath.Matrix4();
			var id = this._quadBatch.add(trans, material.color, 0, material.luminosity);
			geometry.quadIds.push(id);
			geometry.quadTransforms.push(trans.clone());
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

			var engine = this._engine;
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
				engine.setBlendMode(material.blendMode);
				engine.setProgram(material.program, globalParams);

				for (var meshIdx = 0; meshIdx < geometry.meshes.length; ++meshIdx) {
					var mesh = geometry.meshes[meshIdx];
					var trans = geometry.transforms[meshIdx];

					var globalTrans = worldMatrix.clone();
					if (trans !== undefined) {
						globalTrans.mul(trans.transform);
					}

					var localParams = {};
					localParams.uWorld = globalTrans.val;
					localParams.uWorldIT = globalTrans.clone().invert().transpose().val;
					engine.setProgramParameters(localParams);
					mesh.render(this._engine);
				}

				for (var quadIdx = 0; quadIdx < geometry.quadIds.length; ++quadIdx) {
					var quadId = geometry.quadIds[quadIdx];
					var localTrans = geometry.quadTransforms[quadIdx];
					var transform = worldMatrix.clone().mul(localTrans);
					this._quadBatch.setTransform(quadId, transform);
				}
			}

			this._quadBatch.prepare(engine);
			this._quadBatch.setParams(globalParams);				
			engine.setBlendMode(this._quadBatch.material.blendMode);
			engine.setProgram(this._quadBatch.material.program, globalParams);
			this._quadBatch.render(engine);
		}		
	});

	module.GeometrySystem = GeometrySystem;
	return module;
})(Jabaku || {});
