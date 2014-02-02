'use strict';

function MeshPart() {
	this._vertices = [];
	this._indices = [];
	this._description = {};
}
MeshPart.extends(Object, {
	_calcDescription: function() {
		var description = this._description;
		var componentCount = 0;
		for (var name in description) {
			var attributeDesc = description[name];
			attributeDesc.offset = componentCount * 4;
			componentCount += attributeDesc.components;
		}
		for (var name in description) {
			description[name].stride = componentCount * 4;
		}
	},	
	createBuffers: function(engine) {
		this._calcDescription();
		this._vb = engine.createVertexBuffer(this._vertices);
		this._ib = engine.createIndexBuffer(this._indices);
	},
	render: function(engine) {
		engine.setBuffers(this._vb, this._ib, this._description);
		engine.renderTriangles(this._indices.length, 0);
	}
});

function Mesh() {
	this._parts = new Array();
}
Mesh.extends(Object, {
	createBuffers: function(engine) {
		this._parts.forEach(function(meshPart) {
			meshPart.createBuffers(engine);
		});
	},
	render: function(engine) {
		this._parts.forEach(function(meshPart) {
			meshPart.render(engine);
		});
	}
});

Mesh.loadFromJson = function(engine, data) {
	var mesh = new Mesh();
	data.forEach(function(part) {
		var meshPart = new MeshPart();
		meshPart._vertices = part.vertices;
		meshPart._indices = part.indices;
		meshPart._description = part.description;
		mesh._parts.push(meshPart);
	});
	
	mesh.createBuffers(engine);
	
	return mesh;
};
Mesh.loadFromFile = function(engine, path) {
	var data = JSON.parse(FileUtils.loadFile(path));
	return Mesh.loadFromJson(engine, data);
};
