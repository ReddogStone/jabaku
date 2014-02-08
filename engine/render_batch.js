var Jabaku = (function(module) {
	'use strict';

	function copyArray(source, sourceOffset, addToSource, dest, destOffset, count) {
		for (var i = 0; i < count; ++i) {
			dest[i + destOffset] = source[i + sourceOffset] + addToSource;
		}
	}

	function RenderBatch(engine, instanceMesh, instanceDataDesc) {
		this._ids = [];
		this._idToIndex = {};
		this._nextId = 0;

		this._vertices = [];
		this._indices = [];
		this._instanceData = [];
		this._instanceDataDesc = instanceDataDesc;
		this._instanceCount = 0;
		
		this._instanceMesh = instanceMesh;
		this._instanceVertexCount = 0;
		this._instanceDataLength = 0;
		this._calcMeshData();
		this._createBuffers(engine);
	}
	RenderBatch.extends(Object, {
		_calcMeshData: function() {
			var instanceMesh = this._instanceMesh;
			var description = instanceMesh.description;
			var componentCount = 0;
			for (var name in description) {
				var attributeDesc = description[name];
				attributeDesc.offset = componentCount * 4;
				componentCount += attributeDesc.components;
			}
			for (var name in description) {
				description[name].stride = componentCount * 4;
			}
			this._instanceVertexCount = instanceMesh.vertices.length / componentCount;
			this._instanceIndexCount = instanceMesh.indices.length;
			
			var instanceDataDesc = this._instanceDataDesc;
			var instanceDataLength = 0;
			for (var name in instanceDataDesc) {
				var attributeDesc = instanceDataDesc[name];
				attributeDesc.offset = instanceDataLength * 4;
				instanceDataLength += attributeDesc.components;
			}
			for (var name in instanceDataDesc) {
				instanceDataDesc[name].stride = instanceDataLength * 4;
			}
			this._instanceDataLength = instanceDataLength;
		},
		_createBuffers: function(engine) {
			this._vb = engine.createVertexBufferWithSize(2 << 18);
			this._ib = engine.createIndexBufferWithSize(2 << 18);
			this._instanceDataBuffer = engine.createVertexBufferWithSize(2 << 18, true);

			this._vertices._dirty = false;
			this._indices._dirty = false;
			this._instanceData._dirty = false;
		},
		get instanceDataLength() {
			return this._instanceDataLength;
		},
		getInstanceCount: function() {
			return this._instanceCount;
		},
		setInstanceCount: function(value) {
			if (this._instanceCount != value) {
				var instanceMesh = this._instanceMesh;
				var instanceVertices = instanceMesh.vertices;
				var instanceIndices = instanceMesh.indices;
				var vLength = instanceVertices.length;
				var iLength = instanceIndices.length;
				var instanceVertexCount = this._instanceVertexCount;
				
				this._vertices.length = value * vLength;
				this._indices.length = value * iLength;
				for (var i = 0; i < value; ++i) {
					copyArray(instanceVertices, 0, 0, this._vertices, i * vLength, vLength);
					copyArray(instanceIndices, 0, i * instanceVertexCount, this._indices, i * iLength, iLength);
				}

				this._vertices._dirty = true;
				this._indices._dirty = true;
				
				this._instanceCount = value;
			}
		},
		setInstanceData: function(data) {
			var instanceDataLength = this._instanceDataLength;
			var l = data.length;
			var instanceVertexCount = this._instanceVertexCount;
			var instanceData = this._instanceData;
			var instanceCount = this._instanceCount;
			
			instanceData.length = l * instanceVertexCount;
			for (var i = 0; i < instanceCount; ++i) {
				for (var j = 0; j < instanceVertexCount; ++j) {
					copyArray(data, i * instanceDataLength, 0, instanceData, (i * instanceVertexCount + j) * instanceDataLength, instanceDataLength);
				}
			}
			
			instanceData._dirty = true;
		},
		addSingleInstance: function(data) {
			var instanceDataLength = this._instanceDataLength;
			var instanceVertexCount = this._instanceVertexCount;
			var instanceData = this._instanceData;
			var offset = instanceData.length;
			
			instanceData.length += instanceDataLength * instanceVertexCount;
			for (var i = 0; i < instanceVertexCount; ++i) {
				copyArray(data, 0, 0, instanceData, offset + i * instanceDataLength, instanceDataLength);
			}
			instanceData._dirty = true;

			var id = this._nextId++;
			this._ids.push(id);
			this._idToIndex[id] = this._ids.length - 1;

			this.setInstanceCount(this._instanceCount + 1);

			return id;
		},
		removeSingleInstance: function(id) {
			var index = this._idToIndex[id];

			var instanceDataLength = this._instanceDataLength;
			var instanceVertexCount = this._instanceVertexCount;
			var instanceData = this._instanceData;
			var offset = index * instanceDataLength * instanceVertexCount;
			var chunkSize = instanceDataLength * instanceVertexCount;

			copyArray(instanceData, instanceData.length - chunkSize, 0, instanceData, offset, chunkSize);
			instanceData._dirty = true;

			var lastIndex = this._ids.length - 1;
			var lastId = this._ids[lastIndex];
			this._ids[index] = this._ids[lastIndex];
			delete this._idToIndex[id];
			this._idToIndex[lastId] = index;

			this.setInstanceCount(this._instanceCount - 1);
		},	
		getSingleInstance: function(id) {
			var index = this._idToIndex[id];

			var instanceDataLength = this._instanceDataLength;
			var instanceVertexCount = this._instanceVertexCount;
			var instanceData = this._instanceData;
			
			var result = new Array(instanceDataLength);
			copyArray(instanceData, index * instanceDataLength * instanceVertexCount, 0, result, 0, instanceDataLength);
			return result;
		},
		setSingleInstance: function(id, data) {
			var index = this._idToIndex[id];

			var instanceDataLength = this._instanceDataLength;
			var instanceVertexCount = this._instanceVertexCount;
			var instanceData = this._instanceData;
			var offset = index * instanceDataLength * instanceVertexCount;
			
			for (var i = 0; i < instanceVertexCount; ++i) {
				copyArray(data, 0, 0, instanceData, offset + i * instanceDataLength, instanceDataLength);
			}
			
			instanceData._dirty = true;
		},
		setComponent: function(id, setter) {
			var data = this.getSingleInstance(id);
			setter(data);
			this.setSingleInstance(id, data);
		},	
		
		// renderable interface
		prepare: function(engine) {
			if (this._instanceData._dirty) {
				engine.updateVertexBufferData(this._instanceDataBuffer, this._instanceData);
			}
			if (this._vertices._dirty) {
				engine.updateVertexBufferData(this._vb, this._vertices);
			}
			if (this._indices._dirty) {
				engine.updateIndexBufferData(this._ib, this._indices);
			}
			
			this._vertices._dirty = false;
			this._indices._dirty = false;
			this._instanceData._dirty = false;
		},
		render: function(engine) {
			engine.setBuffers(this._vb, this._ib, this._instanceMesh.description);
			engine.setVertexBuffer(this._instanceDataBuffer, this._instanceDataDesc);
			engine.renderTriangles(this._indices.length, 0);
		}
	});

	module.RenderBatch = RenderBatch;
	return module;
})(Jabaku || {});
