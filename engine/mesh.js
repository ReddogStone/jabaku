'use strict';

var Mesh = (function() {
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

	return function(createVertexBuffer, createIndexBuffer) {
		return {
			make: function(data) {
				return {
					vertices: data.vertices,
					indices: data.indices,
					description: calcFullDescription(data.description),
					vertexBuffer: createVertexBuffer(data.vertices),
					indexBuffer: createIndexBuffer(data.indices)
				};
			},
			render: function(withBuffers, mesh) {
//				engine.setBuffers(mesh.vertexBuffer, mesh.indexBuffer, mesh.description);
//				engine.renderTriangles(mesh.indices.length, 0);

				withBuffers(mesh.vertexBuffer, mesh.indexBuffer, mesh.description, function(renderTriangles) {
					renderTriangles(mesh.indices.length, 0);
				});
			}
		}
	};
})();