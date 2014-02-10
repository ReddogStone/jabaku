attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;
attribute vec4 aWorldX;
attribute vec4 aWorldY;
attribute vec4 aWorldZ;
attribute vec4 aWorldW;
attribute vec4 aColor;
attribute vec2 aIndexLum;

varying vec3 vNormal;
varying vec2 vTexCoord;
varying vec3 vWorldPos;
varying vec4 vColor;
varying vec2 vIndexLum;
varying float vTest;

uniform mat4 uWorldIT;
uniform mat4 uView;
uniform mat4 uProjection;

void main() {
	mat4 world = mat4(aWorldX, aWorldY, aWorldZ, aWorldW);
	mat4 normalMatrix = mat4(mat3(world));
	vec4 worldPos = world * vec4(aPosition, 1.0);
	mat4 vp = uProjection * uView;
	
	gl_Position = vp * worldPos;

	vec4 testPos = vec4(0.0, 0.0, -6.0, 1.0);
	testPos = uProjection * testPos;
	vTest = testPos.z / testPos.w;

	vWorldPos = worldPos.xyz;
	vTexCoord = aTexCoord;
	vNormal = (normalMatrix * vec4(aNormal, 1.0)).xyz;
	vColor = aColor;
	vIndexLum = aIndexLum;
}