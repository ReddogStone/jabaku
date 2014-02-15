attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;
attribute vec4 aWorldX;
attribute vec4 aWorldY;
attribute vec4 aWorldZ;
attribute vec4 aWorldW;
attribute vec4 aColor;
attribute vec3 aLumDiffSpec;

varying vec3 vNormal;
varying vec2 vTexCoord;
varying vec3 vWorldPos;
varying vec4 vColor;
varying vec3 vLumDiffSpec;

uniform mat4 uWorldIT;
uniform mat4 uView;
uniform mat4 uProjection;

void main() {
	mat4 world = mat4(aWorldX, aWorldY, aWorldZ, aWorldW);
	mat4 normalMatrix = mat4(
		world[0].x, world[0].y, world[0].z, 0.0,
		world[1].x, world[1].y, world[1].z, 0.0,
		world[2].x, world[2].y, world[2].z, 0.0,
		0.0, 0.0, 0.0, 1.0
	);
	vec4 worldPos = world * vec4(aPosition, 1.0);
	mat4 vp = uProjection * uView;
	
	gl_Position = vp * worldPos;

	vWorldPos = worldPos.xyz;
	vTexCoord = aTexCoord;
	vNormal = (normalMatrix * vec4(aNormal, 1.0)).xyz;
	vColor = aColor;
	vLumDiffSpec = aLumDiffSpec;
}