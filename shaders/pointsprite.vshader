attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;

uniform mat4 uWorld;
uniform mat4 uView;
uniform mat4 uProjection;
uniform vec2 uScreenSize;
uniform vec2 uSize;

void main() {
	vTexCoord = aTexCoord;
	
	vec4 clipPos = uProjection * uView * uWorld * vec4(0.0, 0.0, 0.0, 1.0);
	vec2 clipSize = vec2(2.0, 2.0) * uSize / uScreenSize;
	gl_Position = vec4(clipPos.xy / clipPos.w + aPosition.xy * clipSize, clipPos.z / clipPos.w, 1.0);
}