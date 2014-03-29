var Jabaku = (function(module) {
	function createQuadData() {
		return {
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
		};
	}

	function createCylinderData(sides) {
		var vertices = new Array(2 * 8 * (sides + 1));

		var off = 0;
		for (var i = 0; i < sides + 1; ++i) {
			var angle = i * 2 * Math.PI / sides;
			var s = Math.sin(angle);
			var c = Math.cos(angle);

			vertices[off++] = 0.5 * c; vertices[off++] = 0.5 * s; vertices[off++] = 0.5; // top x, y, z
			vertices[off++] = c; vertices[off++] = s; vertices[off++] = 0.0; // top nx, ny, nz
			vertices[off++] = i % 2; vertices[off++] = 0.0; // top tu, tv
			vertices[off++] = 0.5 * c; vertices[off++] = 0.5 * s; vertices[off++] = -0.5; // bottom x, y, z
			vertices[off++] = c; vertices[off++] = s; vertices[off++] = 0.0; // bottom nx, ny, nz
			vertices[off++] = i % 2; vertices[off++] = 1.0; // bottom tu, tv
		}

		var indices = new Array(3 * 2 * sides);
		var off = 0;
		for (var i = 0; i < sides; ++i) {
			var indexOff = i * 2;
			indices[off++] = indexOff; indices[off++] = indexOff + 1; indices[off++] = indexOff + 2;
			indices[off++] = indexOff + 2; indices[off++] = indexOff + 1; indices[off++] = indexOff + 3;
		}

		return {
			"vertices": vertices,
			"indices": indices,
			"description": {
				"aPosition": { "components": 3, "type": "FLOAT", "normalized": false },
				"aNormal": { "components": 3, "type": "FLOAT", "normalized": false },
				"aTexCoord": { "components": 2, "type": "FLOAT", "normalized": false }
			}
		};
	}

	function createCubeData() {
		return {
			"vertices": [
				//x	y z nx ny nz tu tv
				// front
				-0.5,  0.5, 0.5, 0.0, 0.0, 1.0, 0.0, 0.0,
				 0.5,  0.5, 0.5, 0.0, 0.0, 1.0, 1.0, 0.0,
				-0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 0.0, 1.0,
				 0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 1.0, 1.0,
				 // back
				 0.5,  0.5, -0.5, 0.0, 0.0, -1.0, 0.0, 0.0,
				-0.5,  0.5, -0.5, 0.0, 0.0, -1.0, 1.0, 0.0,
				 0.5, -0.5, -0.5, 0.0, 0.0, -1.0, 0.0, 1.0,
				-0.5, -0.5, -0.5, 0.0, 0.0, -1.0, 1.0, 1.0,
				 // right
				 0.5, -0.5,  0.5, 1.0, 0.0, 0.0, 0.0, 0.0,
				 0.5,  0.5,  0.5, 1.0, 0.0, 0.0, 1.0, 0.0,
				 0.5, -0.5, -0.5, 1.0, 0.0, 0.0, 0.0, 1.0,
				 0.5,  0.5, -0.5, 1.0, 0.0, 0.0, 1.0, 1.0,
				 // left
				-0.5,  0.5,  0.5, -1.0, 0.0, 0.0, 0.0, 0.0,
				-0.5, -0.5,  0.5, -1.0, 0.0, 0.0, 1.0, 0.0,
				-0.5,  0.5, -0.5, -1.0, 0.0, 0.0, 0.0, 1.0,
				-0.5, -0.5, -0.5, -1.0, 0.0, 0.0, 1.0, 1.0,
				 // top
				-0.5, 0.5,  0.5, 0.0, 1.0, 0.0, 0.0, 0.0,
				 0.5, 0.5,  0.5, 0.0, 1.0, 0.0, 1.0, 0.0,
				-0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 0.0, 1.0,
				 0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 1.0, 1.0,
				 // bottom
				 0.5, -0.5,  0.5, 0.0, -1.0, 0.0, 0.0, 0.0,
				-0.5, -0.5,  0.5, 0.0, -1.0, 0.0, 1.0, 0.0,
				 0.5, -0.5, -0.5, 0.0, -1.0, 0.0, 0.0, 1.0,
				-0.5, -0.5, -0.5, 0.0, -1.0, 0.0, 1.0, 1.0,
				 ],
			"indices": [
				0, 1, 2, 2, 1, 3,
				4, 5, 6, 6, 5, 7,
				8, 9, 10, 10, 9, 11,
				12, 13, 14, 14, 13, 15,
				16, 17, 18, 18, 17, 19,
				20, 21, 22, 22, 21, 23,
			],
			"description": {
				"aPosition": { "components": 3, "type": "FLOAT", "normalized": false },
				"aNormal": { "components": 3, "type": "FLOAT", "normalized": false },
				"aTexCoord": { "components": 2, "type": "FLOAT", "normalized": false }
			}
		};
	}	

	function subdividedSphereFace(vertices, indices, offsets, u, v, w, front, subdivisions) {
		var off = offsets.vertex; var firstVertex = 0;
		var startVertex = off / 8;
		for (var i = 0; i < subdivisions + 2; ++i) {
			for (var j = 0; j < subdivisions + 2; ++j) {
				var pos = new Vecmath.Vector3();
				pos[u] = -0.5 + j / (subdivisions + 1);
				pos[v] = 0.5 - i / (subdivisions + 1);
				pos[w] = 0.5;

				if (!front) {
					pos[u] = -pos[u];
					pos[w] = -pos[w];
				}

				pos.normalize();
				vertices[off++] = pos.x; vertices[off++] = pos.y; vertices[off++] = pos.z;
				vertices[off++] = pos.x; vertices[off++] = pos.y; vertices[off++] = pos.z;
				vertices[off++] = j % 2; vertices[off++] = i % 2;
			}
		}
		var idx = offsets.index;
		for (var i = 0; i < subdivisions + 1; ++i) {
			var row = startVertex + i * (subdivisions + 2);
			var nextRow = startVertex + (i + 1) * (subdivisions + 2);
			for (var j = 0; j < subdivisions + 1; ++j) {
				indices[idx++] = row + j;
				indices[idx++] = row + j + 1;
				indices[idx++] = nextRow + j;
				indices[idx++] = nextRow + j;
				indices[idx++] = row + j + 1;
				indices[idx++] = nextRow + j + 1;
			}
		}

		offsets.vertex = off;
		offsets.index = idx;
	}

	function createSphereData(subdivisions) {
		var vertices = new Array(8 * 6 * (subdivisions + 2) * (subdivisions + 2));
		var indices = new Array(6 * 2 * (subdivisions + 1) * (subdivisions + 1));

		var offsets = {vertex: 0, index: 0};
		subdividedSphereFace(vertices, indices, offsets, 'x', 'y', 'z', true, subdivisions);
		subdividedSphereFace(vertices, indices, offsets, 'x', 'y', 'z', false, subdivisions);
		subdividedSphereFace(vertices, indices, offsets, 'y', 'z', 'x', true, subdivisions);
		subdividedSphereFace(vertices, indices, offsets, 'y', 'z', 'x', false, subdivisions);
		subdividedSphereFace(vertices, indices, offsets, 'x', 'z', 'y', true, subdivisions);
		subdividedSphereFace(vertices, indices, offsets, 'x', 'z', 'y', false, subdivisions);

		return {
			vertices: vertices,
			indices: indices,
			description: {
				aPosition: { components: 3, type: "FLOAT", normalized: false },
				aNormal: { components: 3, type: "FLOAT", normalized: false },
				aTexCoord: { components: 2, type: "FLOAT", normalized: false }
			}			
		};
	}

	function createQuadMesh(engine) {
		var meshData = [createQuadData()];
		return Mesh.loadFromJson(engine, meshData);
	}

	function createCylinderMesh(engine, sides) {
		var meshData = [createCylinderData(sides)];
		return Mesh.loadFromJson(engine, meshData);
	}

	function createCubeMesh(engine) {
		var meshData = [createCubeData()];
		return Mesh.loadFromJson(engine, meshData);
	}

	function createSphereMesh(engine, subdivisions) {
		var meshData = [createSphereData(subdivisions)];
		return Mesh.loadFromJson(engine, meshData);
	}

	module.createQuadData = createQuadData;
	module.createQuadMesh = createQuadMesh;
	module.createCubeMesh = createCubeMesh;
	module.createCylinderData = createCylinderData;
	module.createCylinderMesh = createCylinderMesh;
	module.createSphereData = createSphereData;
	module.createSphereMesh = createSphereMesh;
	return module;
})(Jabaku || {});
