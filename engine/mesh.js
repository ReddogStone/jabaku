'use strict';

// description == { components, type, normalized }
// full descripition == { components, type, normalized, offset, stride }
function calcFullDescription(description) {
	var result = {};

	var componentCount = 0;
	for (var name in description) {
		var attributeDesc = description[name];
		result[name] = {
			components: attributeDesc.components,
			type: attributeDesc.type,
			normalized: attributeDesc.normalized,
			offset: componentCount * 4
		};
		componentCount += attributeDesc.components;
	}
	for (var name in result) {
		result[name].stride = componentCount * 4;
	}

	return result;
}

module.exports = function(engine3d) {
	return {
		make: function(data) {
			return {
				vertices: data.vertices,
				indices: data.indices,
				description: calcFullDescription(data.description),
				vertexBuffer: engine3d.createVertexBuffer(data.vertices),
				indexBuffer: engine3d.createIndexBuffer(data.indices)
			};
		},
		render: function(program, mesh) {
			engine3d.setBuffers(program, mesh.vertexBuffer, mesh.indexBuffer, mesh.description);
			engine3d.renderTriangles(mesh.indices.length, 0);
		}
	};
};
