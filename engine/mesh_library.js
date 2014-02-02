var Jabaku = (function(module) {
	function createQuadMesh(engine) {
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
		return Mesh.loadFromJson(engine, meshData);
	}

	function createCubeMesh(engine) {
		var meshData = [
			{
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
			}
		];
		return Mesh.loadFromJson(engine, meshData);
	}

	module.createQuadMesh = createQuadMesh;
	module.createCubeMesh = createCubeMesh;
	return module;
})(Jabaku || {});
