'use strict';

function Viewport(x, y, sx, sy) {
	this.x = x || 0;
	this.y = y || 0;
	
	if (sx) {
		this.sx = sx;
		this.sy = sy;
	} else {
		var canvas = document.getElementById('canvas');
		this.sx = canvas.width;
		this.sy = canvas.height;
	}
}
Viewport.extends(Object, {
	toVector4: function() {
		return new Vecmath.Vector4(this.x, this.y, this.sx, this.sy);
	}
});
Viewport.clone = function(value) {
	return new Viewport(value.x, value.y, value.sx, value.sy);
};

function Scene() {
	this._entities = [];
	this._pointLight1 = null;
	this._pointLight2 = null;
}
Scene.extends(Object, {
	get pointLight1() {
		return this._pointLight1;
	},
	set pointLight1(value) {
		this._pointLight1 = PointLight.clone(value);
	},
	get pointLight2() {
		return this._pointLight2;
	},
	set pointLight2(value) {
		this._pointLight2 = PointLight.clone(value);
	},
	get camEntity() {
		return this._camEntity;
	},
	set camEntity(value) {
		this._camEntity = value;
	},
	addEntity: function(entity) {
		this._entities.push(entity);
	},
	removeEntity: function(entity) {
		this._entities.remove(entity);
	},
	render: function(engine, viewport, camEntity) {
		function arraysEqual(a1, a2) {
			var l = a2.length;
			for (var i = 0; i < l; ++i) {
				if (a1[i] != a2[i]) {
					return false;
				}
			}
			return true;
		}
	
		function paramDiff(oldParams, newParams) {
			var result = {};
			for (var paramName in newParams) {
				if (paramName in oldParams) {
					var oldParam = oldParams[paramName];
					var newParam = newParams[paramName];
					var equal = false;
					if (Array.isArray(newParam) && Array.isArray(oldParam)) {
						equal = arraysEqual(oldParam, newParam);
					} else {
						equal = (oldParam == newParam);
					}
					if (equal) {
						continue;
					}
				}
				
				result[paramName] = newParams[paramName];
			}
			return result;
		}
		
		function cloneParams(params) {
			var result = {};
			for (var paramName in params) {
				result[paramName] = params[paramName];
			}
			return result;
		}
	
		FrameProfiler.start('SetViewport');
		engine.setViewport(viewport);
		FrameProfiler.stop();
		
		FrameProfiler.start('GetCameraStuff');
		var bufferSize = engine.getDrawingBufferSize();
		var camera = camEntity.camera;
		var view = camera.getView(camEntity.transformable);
		var projection = camera.getProjection();
		FrameProfiler.stop();
		
		FrameProfiler.start('GatherParams');
		var params = {
			uView: view.val,
			uProjection: projection.val,
			uScreenSize: [bufferSize.x, bufferSize.y]
		};
		if (this._pointLight1) {
			params.uPosLight1 = this._pointLight1.pos.toArray();
			params.uColorLight1 = this._pointLight1.color.toArray3();
		}
		if (this._pointLight2) {
			params.uPosLight2 = this._pointLight2.pos.toArray();
			params.uColorLight2 = this._pointLight2.color.toArray3();
		}
		FrameProfiler.stop();
		
		FrameProfiler.start('SortByZ');
		var entities = this._entities;
		var entityCount = entities.length;
		for (var i = 0; i < entityCount; ++i) {
			var entity = entities[i];
			if (entity.transformable) {
				entity.viewZ = entity.transformable.pos.clone().transformMat4(view).z;
			} else {
				entity.viewZ = 0.0;
			}
		}
		
		this._entities.sort(function(e1, e2) {
			return e1.viewZ - e2.viewZ;
		});
		FrameProfiler.stop();
		
		FrameProfiler.start('Render');
		var lastProgram = null;
		var lastParams = {};
		var lastBlendMode = null;
		for (var i = 0; i < entityCount; ++i) {
			var entity = entities[i];
			var renderable = entity.renderable;
			if (!renderable.invisible) {
				if (entity.transformable) {
					params.uWorld = entity.transformable.transform.val;
				}
				
				renderable.prepare(engine);
				var material = renderable.material;
				renderable.setParams(params);
				
				var program = material.program;
				var blendMode = material.blendMode;
				
				if (lastBlendMode != blendMode) {
					engine.setBlendMode(blendMode);
					lastBlendMode = blendMode;
				}
				
				if (lastProgram != program) {
					engine.setProgram(program, params);
					lastProgram = program;
					lastParams = cloneParams(params);
				} else {
					var diff = paramDiff(lastParams, params);
					lastParams = cloneParams(params);
					engine.setProgramParameters(diff);
				}
				
				renderable.render(engine);
			}
		}
		FrameProfiler.stop();
	}
});
